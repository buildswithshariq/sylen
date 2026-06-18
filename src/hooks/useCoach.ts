'use client';

import { useState, useCallback, useRef } from 'react';
import { CoachContext, CoachMessage, CoachRole } from '@/types';
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
    
    let i = 0;
    const streamInterval = setInterval(() => {
      i += Math.max(2, Math.floor(greeting.length / 40));
      if (i >= greeting.length) {
        i = greeting.length;
        clearInterval(streamInterval);
        setMessages((prev) => 
          prev.map(m => m.id === greetingMessage.id ? { ...m, content: greeting, isStreaming: false } : m)
        );
      } else {
        setMessages((prev) => 
          prev.map(m => m.id === greetingMessage.id ? { ...m, content: greeting.slice(0, i) } : m)
        );
      }
    }, 30);
  }, [context]);

  // Send a message to the coach
  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim() || isLoading) return;

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
            context, // can be null
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

          const chunkText = decoder.decode(value, { stream: true });
          fullContent += chunkText;

          // Process uiCard based on current content
          const lowerContent = fullContent.toLowerCase();
          let uiCard: 'priority' | 'breakdown' | 'transport' | undefined;
          
          if (lowerContent.includes('improve') || lowerContent.includes('recommendation') || lowerContent.includes('action')) {
            uiCard = 'priority';
          } else if (lowerContent.includes('breakdown') || lowerContent.includes('source') || lowerContent.includes('explain')) {
            uiCard = 'breakdown';
          } else if (lowerContent.includes('transport') || lowerContent.includes('drive') || lowerContent.includes('fly')) {
            uiCard = 'transport';
          }

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
  const pushMessage = useCallback((content: string, role: CoachRole = 'assistant') => {
    const newMsg: CoachMessage = {
      id: `msg-${Date.now()}`,
      role,
      content,
      timestamp: Date.now(),
      isStreaming: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    
    let i = 0;
    const streamInterval = setInterval(() => {
      i += Math.max(2, Math.floor(content.length / 40));
      if (i >= content.length) {
        i = content.length;
        clearInterval(streamInterval);
        setMessages((prev) => 
          prev.map(m => m.id === newMsg.id ? { ...m, content, isStreaming: false } : m)
        );
      } else {
        setMessages((prev) => 
          prev.map(m => m.id === newMsg.id ? { ...m, content: content.slice(0, i) } : m)
        );
      }
    }, 30);
  }, []);

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
