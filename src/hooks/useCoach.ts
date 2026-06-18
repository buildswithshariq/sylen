'use client';

import { useState, useCallback, useRef } from 'react';
import { CoachContext, CoachMessage, CoachRole } from '@/types';
import { generateInitialGreeting } from '@/lib/coachEngine';

/**
 * Simulates a typewriter streaming effect for a message.
 * Extracted to reduce nesting depth inside useCoach callbacks.
 */
function simulateStream(
  content: string,
  msgId: string,
  setMessages: React.Dispatch<React.SetStateAction<CoachMessage[]>>
) {
  let i = 0;
  const streamInterval = setInterval(() => {
    i += Math.max(2, Math.floor(content.length / 40));
    const finished = i >= content.length;
    const slicedContent = finished ? content : content.slice(0, i);

    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? { ...m, content: slicedContent, isStreaming: !finished }
          : m
      )
    );

    if (finished) {
      clearInterval(streamInterval);
    }
  }, 30);
}

/**
 * Determines which generative UI card to attach based on response content.
 */
function detectUiCard(content: string): 'priority' | 'breakdown' | 'transport' | undefined {
  const lower = content.toLowerCase();
  if (lower.includes('improve') || lower.includes('recommendation') || lower.includes('action')) {
    return 'priority';
  }
  if (lower.includes('breakdown') || lower.includes('source') || lower.includes('explain')) {
    return 'breakdown';
  }
  if (lower.includes('transport') || lower.includes('drive') || lower.includes('fly')) {
    return 'transport';
  }
  return undefined;
}

/**
 * Hook for managing the AI coach conversation.
 * Simple: single chat, last 5 messages, streaming.
 */
export function useCoach(context: CoachContext | null) {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasGreeted = useRef(false);

  // Generate initial greeting
  const initializeGreeting = useCallback(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;

    const greeting = generateInitialGreeting(context);
    const greetingMessage: CoachMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    };
    setMessages([greetingMessage]);
    simulateStream(greeting, greetingMessage.id, setMessages);
  }, [context]);

  // Send a message to the coach
  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || isLoading) return;

      setError(null);

      const userMsg: CoachMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: userMessage.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        const recentHistory = messages.slice(-5);

        const response = await fetch('/api/coach', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: userMessage.trim(),
            context,
            history: recentHistory,
          }),
        });

        if (!response.ok || !response.body) {
          throw new Error('Failed to get response from coach');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullContent = '';

        const msgId = `msg-${Date.now() + 1}`;
        const assistantMsg: CoachMessage = {
          id: msgId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
          isStreaming: true,
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setIsLoading(false);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          fullContent += decoder.decode(value, { stream: true });
          const uiCard = detectUiCard(fullContent);

          setMessages((prev) =>
            prev.map((m) =>
              m.id === msgId ? { ...m, content: fullContent, uiCard } : m
            )
          );
        }

        // Finish streaming
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, isStreaming: false } : m
          )
        );
      } catch (err) {
        setError('Failed to get a response. Please try again.');
        console.error('Coach error:', err);
        setIsLoading(false);
      }
    },
    [context, isLoading, messages]
  );

  // Clear conversation
  const clearChat = useCallback(() => {
    setMessages([]);
    hasGreeted.current = false;
    setError(null);
  }, []);

  // Push a message directly
  const pushMessage = useCallback(
    (content: string, role: CoachRole = 'assistant') => {
      const newMsg: CoachMessage = {
        id: `msg-${Date.now()}`,
        role,
        content: '',
        timestamp: Date.now(),
        isStreaming: true,
      };
      setMessages((prev) => [...prev, newMsg]);
      simulateStream(content, newMsg.id, setMessages);
    },
    []
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    initializeGreeting,
    clearChat,
    pushMessage,
  };
}
