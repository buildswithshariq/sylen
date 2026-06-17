// ============================================================
// EcoPilot AI — Coach Engine (Gemini 2.5 Flash Integration)
// Builds structured prompts and manages AI coaching context.
// AI NEVER calculates — only explains, personalizes, coaches.
// ============================================================

import { CoachContext, CoachMessage } from '@/types';

/**
 * Build the system prompt for the AI coach.
 * Injects the user's actual data so AI can reference real numbers.
 */
export function buildSystemPrompt(context: CoachContext): string {
  const { score, recommendations, ecoLevel, assessment } = context;

  const topSource = score.contributions[0];
  const topRecs = recommendations
    .slice(0, 5)
    .map((r, i) => `${i + 1}. ${r.title} (saves ~${r.estimatedReductionKg} kg CO₂e/yr, difficulty: ${r.difficulty})`)
    .join('\n');

  const breakdownStr = score.contributions
    .map((c) => `- ${c.label}: ${score.breakdown[c.category as keyof typeof score.breakdown].toLocaleString()} kg CO₂e/yr (${c.percentage}%)`)
    .join('\n');

  return `You are EcoPilot AI, a friendly and knowledgeable sustainability coach. You help people understand and reduce their carbon footprint through practical, encouraging advice.

## USER'S CARBON FOOTPRINT DATA (use these exact numbers)

**Sustainability Score:** ${score.score}/100 (${score.categoryLabel})
**Total Annual Emissions:** ${score.totalEmissions.toLocaleString()} kg CO₂e/year
**Comparison to US Average:** ${score.comparisonToAverage > 0 ? `${score.comparisonToAverage}% above` : `${Math.abs(score.comparisonToAverage)}% below`} average (16,000 kg CO₂e/yr)
**Eco Level:** ${ecoLevel.current.badge} ${ecoLevel.current.name}${ecoLevel.next ? ` (${ecoLevel.pointsToNext} points to ${ecoLevel.next.name})` : ''}

**Emission Breakdown:**
${breakdownStr}

**Biggest Impact Area:** ${topSource.label} (${topSource.percentage}% of total)

**Transport:** ${assessment.transport.vehicleType === 'car' ? `Drives ${assessment.transport.fuelType} car, ${assessment.transport.dailyDistanceKm}km/day` : `Uses ${assessment.transport.vehicleType.replace('_', ' ')}`}
**Energy:** ${assessment.energy.monthlyElectricityKwh} kWh/month, AC ${assessment.energy.acHoursPerDay} hrs/day
**Food:** ${assessment.food.dietType.replace('_', ' ')} diet, ${assessment.food.meatMealsPerWeek} meat meals/week
**Lifestyle:** ${assessment.lifestyle.flightsPerYear} flights/year, shops ${assessment.lifestyle.shoppingFrequency}, recycles ${assessment.lifestyle.recyclingHabit}

**Top Recommended Actions:**
${topRecs}

## RULES — FOLLOW STRICTLY
1. NEVER calculate or estimate emissions yourself. Always reference the data above.
2. When asked about numbers, use the EXACT figures provided above.
3. Be encouraging, specific, and actionable.
4. Keep responses concise (2-4 paragraphs max).
5. Use the user's actual data to personalize every response.
6. Suggest specific actions from the recommendations list when relevant.
7. Use emojis sparingly for warmth.
8. When asked about improvements, reference the estimated savings from recommendations.
9. If asked something outside sustainability/environment, politely redirect.
10. Format responses with short paragraphs for readability.`;
}

/**
 * Build the messages array for the Gemini API call.
 * Keeps only the last 5 messages for context window efficiency.
 */
export function buildChatMessages(
  context: CoachContext,
  conversationHistory: CoachMessage[],
  newUserMessage: string
): { systemPrompt: string; messages: { role: string; content: string }[] } {
  const systemPrompt = buildSystemPrompt(context);

  // Keep last 5 messages + the new one
  const recentHistory = conversationHistory.slice(-5);

  const messages = recentHistory.map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    content: msg.content,
  }));

  messages.push({
    role: 'user',
    content: newUserMessage,
  });

  return { systemPrompt, messages };
}

/**
 * Generate a contextual initial greeting based on the user's score.
 */
export function generateInitialGreeting(context: CoachContext): string {
  const { score, ecoLevel } = context;
  const topSource = score.contributions[0];

  if (score.score >= 80) {
    return `${ecoLevel.current.badge} Amazing! Your sustainability score is **${score.score}/100** — you're an **${score.categoryLabel}** performer! Your total footprint is ${score.totalEmissions.toLocaleString()} kg CO₂e/year, which is ${Math.abs(score.comparisonToAverage)}% below the US average. That's genuinely impressive.\n\nYour biggest area is **${topSource.label}** at ${topSource.percentage}% of your footprint. I can help you optimize even further. What would you like to know?`;
  }

  if (score.score >= 60) {
    return `${ecoLevel.current.badge} Nice work! Your sustainability score is **${score.score}/100** — that puts you in the **${score.categoryLabel}** category. Your annual footprint is ${score.totalEmissions.toLocaleString()} kg CO₂e.\n\n**${topSource.label}** is your biggest impact area at ${topSource.percentage}%. I have some practical suggestions that could boost your score. Ask me anything about your results or how to improve!`;
  }

  if (score.score >= 40) {
    return `${ecoLevel.current.badge} Thanks for taking the assessment! Your score is **${score.score}/100** (${score.categoryLabel}). Your annual footprint is ${score.totalEmissions.toLocaleString()} kg CO₂e — ${score.comparisonToAverage > 0 ? `${score.comparisonToAverage}% above` : 'around'} the US average.\n\nThe good news? **${topSource.label}** (${topSource.percentage}% of your footprint) has great potential for improvement. I'll help you find easy wins that make a real difference. What would you like to explore first?`;
  }

  return `${ecoLevel.current.badge} I appreciate you taking this step! Your score is **${score.score}/100**, and your annual footprint is ${score.totalEmissions.toLocaleString()} kg CO₂e. That's above average, but here's what matters: **you're here, and you want to improve.**\n\n**${topSource.label}** accounts for ${topSource.percentage}% of your emissions — and that's where we can make the biggest impact. I have specific, practical actions that can dramatically reduce your footprint. Ready to get started?`;
}

/**
 * Fallback responses when Gemini API is unavailable.
 * These are still personalized using context data.
 */
export function getFallbackResponse(
  userMessage: string,
  context: CoachContext
): string {
  const msg = userMessage.toLowerCase();
  const topSource = context.score.contributions[0];
  const topRec = context.recommendations[0];

  if (msg.includes('score') || msg.includes('result')) {
    return `Your sustainability score is **${context.score.score}/100** (${context.score.categoryLabel}). Your total annual emissions are ${context.score.totalEmissions.toLocaleString()} kg CO₂e. Your biggest impact area is **${topSource.label}** at ${topSource.percentage}% of your total footprint.`;
  }

  if (msg.includes('improve') || msg.includes('reduce') || msg.includes('better')) {
    return `Your top recommendation is: **${topRec.title}**. ${topRec.description} This could save approximately ${topRec.estimatedReductionKg.toLocaleString()} kg CO₂e per year. Check out the Recommendations panel for more actions sorted by impact!`;
  }

  if (msg.includes('transport') || msg.includes('car') || msg.includes('commute')) {
    const transportPct = context.score.contributions.find(c => c.category === 'transport')?.percentage ?? 0;
    return `Transportation accounts for ${transportPct}% of your footprint (${context.score.breakdown.transport.toLocaleString()} kg CO₂e/year). ${context.assessment.transport.vehicleType === 'car' ? 'Switching to public transit or carpooling could make a significant difference.' : 'You\'re already using a low-emission transport method — great choice!'}`;
  }

  if (msg.includes('energy') || msg.includes('electric') || msg.includes('ac')) {
    return `Your home energy use contributes ${context.score.breakdown.energy.toLocaleString()} kg CO₂e/year. ${context.assessment.energy.acHoursPerDay > 4 ? `With ${context.assessment.energy.acHoursPerDay} hours of daily AC usage, reducing by even 1-2 hours could save hundreds of kg CO₂e annually.` : 'Your energy usage is moderate. Focus on efficient appliances and LED lighting for further savings.'}`;
  }

  if (msg.includes('food') || msg.includes('diet') || msg.includes('meat')) {
    return `Your food choices account for ${context.score.breakdown.food.toLocaleString()} kg CO₂e/year. ${context.assessment.food.dietType === 'heavy_meat' ? 'Even small reductions in meat consumption can have a big impact. Try starting with one meat-free day per week.' : context.assessment.food.dietType === 'vegan' ? 'Your plant-based diet is one of the most impactful choices — well done!' : 'Consider incorporating more plant-based meals into your routine.'}`;
  }

  return `Your sustainability score is **${context.score.score}/100**. I can help you understand your carbon footprint, explain your results, or suggest specific actions to improve. Try asking about your biggest emission sources, how to improve your score, or specific areas like transport, energy, or food!`;
}
