// ============================================================
// EcoPilot AI — AI Coach API Route
// Tier 1: Gemini 2.5 Flash
// Tier 2: OpenRouter (Multi-model Fallback)
// Tier 3: Local Deterministic Engine
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { CoachContext, CoachMessage } from '@/types';
import { buildChatMessages, getFallbackResponse } from '@/lib/coachEngine';

async function callOpenRouterFallback(apiKey: string, systemPrompt: string, messages: { role: string, content: string }[]): Promise<string> {
  const models = [
    'google/gemma-4-31b-it:free',
    'poolside/laguna-xs.2:free',
    'poolside/laguna-m.1:free'
  ];
  const model = models[Math.floor(Math.random() * models.length)];
  
  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({ 
      role: m.role === 'model' ? 'assistant' : m.role, 
      content: m.content 
    }))
  ];

  console.log(`[Tier 2] Selected OpenRouter Model: ${model}`);
  console.log(`[Tier 2] Request Payload (stripped content):`, { model, temperature: 0.7, max_tokens: 512, messageCount: formattedMessages.length });

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'EcoPilot AI'
    },
    body: JSON.stringify({
      model,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 2048,
    })
  });

  console.log(`[Tier 2] HTTP Status: ${res.status} ${res.statusText}`);

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`[Tier 2] API Error Body:`, errorBody);
    throw new Error(`OpenRouter API error: ${res.status} - ${errorBody}`);
  }

  const data = await res.json();
  console.log(`[Tier 2] Successful API Response received (ID: ${data.id})`);
  
  const content = data.choices?.[0]?.message?.content;
  
  if (!content) {
    console.error(`[Tier 2] OpenRouter returned empty content. Full data:`, JSON.stringify(data));
    throw new Error('OpenRouter returned empty content');
  }
  
  return content;
}

export async function POST(request: NextRequest) {
  let parsedBody: unknown = null;

  try {
    parsedBody = await request.json();
    const {
      message,
      context,
      history,
    } = parsedBody as {
      message: string;
      context: CoachContext;
      history: CoachMessage[];
    };

    // Validate input
    if (!message) {
      return NextResponse.json(
        { error: 'Missing required field: message' },
        { status: 400 }
      );
    }

    // Build standard messages with context
    const { systemPrompt, messages } = buildChatMessages(
      context,
      history || [],
      message
    );

    const geminiKey = process.env.GOOGLE_GEMINI_API_KEY;
    const openRouterKey = process.env.OPENROUTER_API_KEY;

    console.log('\n=========================================');
    console.log('         AI COACH REQUEST STARTED        ');
    console.log('=========================================');
    console.log('[Config] GOOGLE_GEMINI_API_KEY exists?', !!geminiKey, geminiKey ? `(Starts with: ${geminiKey.substring(0, 4)}...)` : '');
    console.log('[Config] OPENROUTER_API_KEY exists?', !!openRouterKey, openRouterKey ? `(Starts with: ${openRouterKey.substring(0, 4)}...)` : '');
    console.log(`[Request] Message length: ${message.length} chars`);
    
    // ==========================================
    // Tier 1: Primary Gemini Engine
    // ==========================================
    if (geminiKey) {
      try {
        console.log('[Tier 1] Sending request to Gemini (gemini-2.5-flash)...');
        const ai = new GoogleGenAI({ apiKey: geminiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: messages.map((m) => ({
            role: m.role as 'user' | 'model',
            parts: [{ text: m.content }],
          })),
          config: {
            systemInstruction: systemPrompt,
            maxOutputTokens: 2048,
            temperature: 0.7,
            topP: 0.9,
          },
        });

        if (response.text) {
          console.log('[Tier 1] Success! Response generated.');
          return NextResponse.json({ content: response.text });
        }
      } catch (geminiError: unknown) {
        console.error('[Tier 1] ERROR ENCOUNTERED:', geminiError instanceof Error ? geminiError.message : String(geminiError));
        // Silently fall through to Tier 2
      }
    } else {
      console.log('[Tier 1] SKIPPING: No GOOGLE_GEMINI_API_KEY provided.');
    }

    // ==========================================
    // Tier 2: OpenRouter Fallback Engine
    // ==========================================
    if (openRouterKey) {
      try {
        console.log('[Tier 2] Attempting OpenRouter Fallback...');
        const fallbackContent = await callOpenRouterFallback(openRouterKey, systemPrompt, messages);
        console.log('[Tier 2] Success! Returning OpenRouter content.');
        return NextResponse.json({ content: fallbackContent });
      } catch (orError: unknown) {
        console.error('[Tier 2] ERROR ENCOUNTERED:', orError instanceof Error ? orError.message : String(orError));
        // Silently fall through to Tier 3
      }
    } else {
      console.log('[Tier 2] SKIPPING: No OPENROUTER_API_KEY provided.');
    }

    // ==========================================
    // Tier 3: Local Deterministic Engine
    // ==========================================
    console.log('[Tier 3] Both Tiers 1 and 2 failed or were skipped. Dropping to deterministic fallback.');
    const localContent = getFallbackResponse(message, context);
    return NextResponse.json({ content: localContent });

  } catch (error: unknown) {
    console.error('Coach API parsing/execution error:', error instanceof Error ? error.message : String(error));
    
    // Absolute worst-case safety net
    const bodyObj = parsedBody as Record<string, unknown>;
    if (bodyObj && typeof bodyObj === 'object' && 'context' in bodyObj && 'message' in bodyObj) {
      console.log('[Tier 3] Absolute worst-case local fallback triggered.');
      const safeFallback = getFallbackResponse(String(bodyObj.message), bodyObj.context as CoachContext);
      return NextResponse.json({ content: safeFallback });
    }

    return NextResponse.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    );
  }
}
