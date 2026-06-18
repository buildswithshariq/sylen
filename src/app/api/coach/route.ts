// ============================================================
// Sylen — AI Coach API Route (Streaming)
// Tier 1: Gemini 2.5 Flash
// Tier 2: OpenRouter (Multi-model Fallback)
// Tier 3: Local Deterministic Engine
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { CoachContext, CoachMessage } from '@/types';
import { buildChatMessages, getFallbackResponse } from '@/lib/coachEngine';

export const runtime = 'edge';

async function streamOpenRouter(
  apiKey: string,
  systemPrompt: string,
  messages: { role: string; content: string }[],
  controller: ReadableStreamDefaultController
) {
  const models = [
    'google/gemma-4-31b-it:free',
    'poolside/laguna-xs.2:free',
    'poolside/laguna-m.1:free',
  ];
  const model = models[Math.floor(Math.random() * models.length)]; /* Math.random() is used only for non-security-critical
                                                                     AI model selection and does not generate
                                                                      credentials, tokens, secrets, or identifiers. */

  const formattedMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role === 'model' ? 'assistant' : m.role,
      content: m.content,
    })),
  ];

  console.log(`[Tier 2] Selected OpenRouter Model: ${model}`);

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'Sylen',
    },
    body: JSON.stringify({
      model,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 2048,
      stream: true,
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenRouter API error: ${res.status}`);
  }

  if (!res.body) {
    throw new Error('No body in OpenRouter response');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n').filter((line) => line.trim() !== '');

    for (const line of lines) {
      if (line.replace(/^data: /, '') === '[DONE]') {
        return;
      }
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.replace(/^data: /, ''));
          const text = data.choices[0]?.delta?.content || '';
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        } catch {
          // Ignore incomplete JSON chunks
        }
      }
    }
  }
}

/**
 * Stream response from Gemini (Tier 1).
 */
async function streamGemini(
  apiKey: string,
  systemPrompt: string,
  messages: { role: string; content: string }[],
  controller: ReadableStreamDefaultController
) {
  const ai = new GoogleGenAI({ apiKey });

  const responseStream = await ai.models.generateContentStream({
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

  for await (const chunk of responseStream) {
    if (chunk.text) {
      controller.enqueue(new TextEncoder().encode(chunk.text));
    }
  }
}

/**
 * Stream a local deterministic fallback response (Tier 3).
 */
async function streamLocalFallback(
  message: string,
  context: CoachContext,
  controller: ReadableStreamDefaultController
) {
  const localContent = getFallbackResponse(message, context);
  for (let i = 0; i < localContent.length; i += 20) {
    controller.enqueue(
      new TextEncoder().encode(localContent.slice(i, i + 20))
    );
    await new Promise((r) => setTimeout(r, 10));
  }
}

export async function POST(request: NextRequest) {
  let parsedBody: unknown = null;

  try {
    parsedBody = await request.json();
    const { message, context, history } = parsedBody as {
      message: string;
      context: CoachContext;
      history: CoachMessage[];
    };

    if (!message) {
      return NextResponse.json(
        { error: 'Missing required field: message' },
        { status: 400 }
      );
    }

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

    const stream = new ReadableStream({
      async start(controller) {
        // Tier 1: Primary Gemini Engine
        if (geminiKey) {
          try {
            console.log('[Tier 1] Streaming response from Gemini (gemini-2.5-flash)...');
            await streamGemini(geminiKey, systemPrompt, messages, controller);
            console.log('[Tier 1] Stream complete.');
            controller.close();
            return;
          } catch (geminiError: unknown) {
            console.error('[Tier 1] ERROR:', geminiError instanceof Error ? geminiError.message : String(geminiError));
          }
        }

        // Tier 2: OpenRouter Fallback Engine
        if (openRouterKey) {
          try {
            console.log('[Tier 2] Streaming response from OpenRouter Fallback...');
            await streamOpenRouter(openRouterKey, systemPrompt, messages, controller);
            console.log('[Tier 2] Stream complete.');
            controller.close();
            return;
          } catch (orError: unknown) {
            console.error('[Tier 2] ERROR:', orError instanceof Error ? orError.message : String(orError));
          }
        }

        // Tier 3: Local Deterministic Engine
        console.log('[Tier 3] Both Tiers 1 and 2 failed. Dropping to deterministic fallback.');
        await streamLocalFallback(message, context, controller);
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (error: unknown) {
    console.error('Coach API parsing/execution error:', error instanceof Error ? error.message : String(error));
    return NextResponse.json(
      { error: 'Failed to generate response. Please try again.' },
      { status: 500 }
    );
  }
}
