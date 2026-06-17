'use client';

import { useState, useCallback, useRef } from 'react';
import { CoachContext, CoachMessage } from '@/types';
import { generateInitialGreeting } from '@/lib/coachEngine';

/**
 * Hook for managing the AI coach conversation.
 * Simple: single chat, last 5 messages, no streaming.
 */
export function useCoach(context: CoachContext | null) {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasGreeted = useRef(false);

  // Generate initial greeting when context becomes available
  const initializeGreeting = useCallback(() => {
    if (!context || hasGreeted.current) return;
    hasGreeted.current = true;

    const greeting = generateInitialGreeting(context);
    const greetingMessage: CoachMessage = {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: greeting,
      timestamp: Date.now(),
    };
    setMessages([greetingMessage]);
  }, [context]);

  // Send a message to the coach
  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!context || !userMessage.trim() || isLoading) return;

      setError(null);

      // Add user message
      const userMsg: CoachMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: userMessage.trim(),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);

      try {
        // Keep last 5 messages for context
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

        if (!response.ok) {
          throw new Error('Failed to get response from coach');
        }

        const data = await response.json();

        const assistantMsg: CoachMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: data.content || 'I apologize, I could not generate a response.',
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        setError('Failed to get a response. Please try again.');
        console.error('Coach error:', err);
      } finally {
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

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    initializeGreeting,
    clearChat,
  };
}
