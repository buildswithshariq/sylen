// ============================================================
// Sylen — Coach Engine (Gemini 2.5 Flash Integration)
// Builds structured prompts and manages AI coaching context.
// AI NEVER calculates — only explains, personalizes, coaches.
// ============================================================

import { CoachContext, CoachMessage } from "@/types";

/**
 * Build the system prompt for the AI coach.
 * Injects the user's actual data if available.
 */
export function buildSystemPrompt(context: CoachContext | null): string {
  if (!context) {
    return `You are Sprout 🌱, a friendly and knowledgeable sustainability companion for Sylen.

## YOUR CAPABILITIES
1. Explain what carbon footprint means
2. Explain climate change concepts
3. Explain sustainability habits
4. Explain how Sylen works
5. Explain why tracking emissions matters
6. Answer general environmental questions
7. Guide users around the platform

## RULES — FOLLOW STRICTLY
1. Be encouraging, helpful, and actionable.
2. Keep responses concise (2-4 paragraphs max).
3. Always function as a real conversational assistant.
4. You can naturally suggest taking the assessment for personalized insights, but DO NOT repeatedly pressure users or force the assessment flow.
5. Example natural suggestion: "I can help you without an assessment, but if you'd like personalized insights, you can take the assessment anytime."
6. If asked something outside sustainability/environment, politely redirect.
7. Format responses with short paragraphs for readability.
8. Always identify yourself as "Sprout" — never as a generic AI.`;
  }

  const { score, recommendations, ecoLevel, assessment } = context;

  const topSource = score.contributions[0];
  const topRecs = recommendations
    .slice(0, 5)
    .map(
      (r, i) =>
        `${i + 1}. ${r.title} (saves ~${r.estimatedReductionKg} kg CO₂e/yr, difficulty: ${r.difficulty})`,
    )
    .join("\n");

  const breakdownStr = score.contributions
    .map(
      (c) =>
        `- ${c.label}: ${score.breakdown[c.category as keyof typeof score.breakdown].toLocaleString()} kg CO₂e/yr (${c.percentage}%)`,
    )
    .join("\n");

  const isChampion = score.score >= 90;

  let responsibilities = `
## YOUR RESPONSIBILITIES
1. Explain the sustainability score calculation methodology.
2. Explain the carbon emission breakdown by category (transport, energy, food, lifestyle).
3. Explain each recommendation and why it was generated.
4. Explain the Eco Level gamification system and how to level up.
5. Explain the 4-week roadmap and its weekly actions.
6. Explain how the What-If Simulator works and what scenarios are available.
7. Explain all dashboard metrics and what they mean.
8. Suggest specific improvements based on the user's data.
9. Guide users around the Sylen platform.
10. Explain the Sylen project mission — making sustainability accessible.
`;

  if (isChampion) {
    responsibilities = `
## YOUR RESPONSIBILITIES
1. Congratulate the user on being a Climate Champion.
2. Explain their positive impact (emissions prevented, equivalents).
3. Encourage them to maintain their sustainable habits.
4. Suggest ways they can inspire their community and lead by example.
5. Explain the carbon emission breakdown.
6. Avoid pushing them to 'do more' or 'improve' drastically, instead focus on celebration and maintenance.
7. Explain the Sylen project mission.
`;
  }

  return `You are Sprout Coach AI 🌱, a friendly and knowledgeable sustainability coach for Sylen. You help people understand and reduce their carbon footprint through practical, encouraging advice.

## USER'S CARBON FOOTPRINT DATA (use these exact numbers)

**Sustainability Score:** ${score.score}/100 (${score.categoryLabel})
**Total Annual Emissions:** ${score.totalEmissions.toLocaleString()} kg CO₂e/year
**Comparison to US Average:** ${score.comparisonToAverage > 0 ? `${score.comparisonToAverage}% above` : `${Math.abs(score.comparisonToAverage)}% below`} average (16,000 kg CO₂e/yr)
**Eco Level:** ${ecoLevel.current.badge} ${ecoLevel.current.name}${ecoLevel.next ? ` (${ecoLevel.pointsToNext} points to ${ecoLevel.next.name})` : ""}
${isChampion ? "**Status:** CLIMATE CHAMPION 🏆" : ""}

**Emission Breakdown:**
${breakdownStr}

**Biggest Impact Area:** ${topSource.label} (${topSource.percentage}% of total)

**Transport:** ${assessment.transport.vehicleType === "car" ? `Drives ${assessment.transport.fuelType} car, ${assessment.transport.dailyDistanceKm}km/day` : `Uses ${assessment.transport.vehicleType.replace("_", " ")}`}
**Energy:** ${assessment.energy.monthlyElectricityKwh} kWh/month, AC ${assessment.energy.acHoursPerDay} hrs/day
**Food:** ${assessment.food.dietType.replace("_", " ")} diet, ${assessment.food.meatMealsPerWeek} meat meals/week
**Lifestyle:** ${assessment.lifestyle.flightsPerYear} flights/year, shops ${assessment.lifestyle.shoppingFrequency}, recycles ${assessment.lifestyle.recyclingHabit}

${isChampion ? "" : `**Top Recommended Actions:**\n${topRecs}\n`}
${responsibilities}

## RULES — FOLLOW STRICTLY
1. NEVER calculate or estimate emissions yourself. Always reference the data above.
2. When asked about numbers, use the EXACT figures provided above.
3. Be encouraging, specific, and actionable.
4. Keep responses concise (2-4 paragraphs max).
5. Use the user's actual data to personalize every response.
${isChampion ? "6. Focus on celebrating their existing good habits." : "6. Suggest specific actions from the recommendations list when relevant."}
7. Use emojis sparingly for warmth.
${isChampion ? "" : "8. When asked about improvements, reference the estimated savings from recommendations."}
9. If asked something outside sustainability/environment, politely redirect.
10. Format responses with short paragraphs for readability.
11. Always identify yourself as "Sprout Coach AI" — never as a generic AI.`;
}

/**
 * Build the messages array for the Gemini API call.
 * Keeps only the last 5 messages for context window efficiency.
 */
export function buildChatMessages(
  context: CoachContext | null,
  conversationHistory: CoachMessage[],
  newUserMessage: string,
): { systemPrompt: string; messages: { role: string; content: string }[] } {
  const systemPrompt = buildSystemPrompt(context);

  // Keep last 5 messages + the new one
  const recentHistory = conversationHistory.slice(-5);

  const messages = recentHistory.map((msg) => ({
    role: msg.role === "user" ? "user" : "model",
    content: msg.content,
  }));

  messages.push({
    role: "user",
    content: newUserMessage,
  });

  return { systemPrompt, messages };
}

/**
 * Generate a contextual initial greeting based on the user's score or lack thereof.
 */
export function generateInitialGreeting(context: CoachContext | null): string {
  if (!context) {
    return `Welcome to Sylen 🌱\n\nI'm Sprout, your sustainability companion.\n\nYou can ask me questions anytime.\n\n*Tip: Take the assessment to watch my island grow and evolve as you build sustainable habits!*`;
  }

  const { score } = context;

  if (score.score >= 90) {
    return `🏆 Congratulations 🎉\n\nYou are a **Climate Champion** operating at an exceptional sustainability level!\n\nYour island is fully grown! 🌳 I've reviewed your sustainability profile and can help explain your score, recommendations, emissions, and improvement opportunities. My role is to help you maintain your impact and inspire others. How can I assist you today?`;
  }

  return `Welcome back to Sylen 🌱\n\nI've analyzed your sustainability profile and I'm ready to help.\n\n*Tip: As you improve your score and level up, my island will grow and evolve!* 🪴`;
}

/**
 * Fallback responses when Gemini API is unavailable.
 * These are still personalized using context data if available.
 */
function containsAny(text: string, keywords: readonly string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

export function getFallbackResponse(
  userMessage: string,
  context: CoachContext | null,
): string {
  if (!context) {
    return `Hi there! I'm Sprout 🌱. I can help answer questions about sustainability, carbon footprints, and Sylen. Try taking the assessment for more personalized insights!`;
  }

  const msg = userMessage.toLowerCase();
  const topSource = context.score.contributions[0];
  const topRec = context.recommendations[0];

  if (containsAny(msg, ["score", "result"])) {
    return `Your sustainability score is **${context.score.score}/100** (${context.score.categoryLabel}). Your total annual emissions are ${context.score.totalEmissions.toLocaleString()} kg CO₂e. Your biggest impact area is **${topSource.label}** at ${topSource.percentage}% of your total footprint.`;
  }

  if (containsAny(msg, ["improve", "reduce", "better"])) {
    return `Your top recommendation is: **${topRec.title}**. ${topRec.description} This could save approximately ${topRec.estimatedReductionKg.toLocaleString()} kg CO₂e per year. Check out the Recommendations panel for more actions sorted by impact!`;
  }

  if (containsAny(msg, ["transport", "car", "commute"])) {
    const transportPct =
      context.score.contributions.find((c) => c.category === "transport")
        ?.percentage ?? 0;
    return `Transportation accounts for ${transportPct}% of your footprint (${context.score.breakdown.transport.toLocaleString()} kg CO₂e/year). ${context.assessment.transport.vehicleType === "car" ? "Switching to public transit or carpooling could make a significant difference." : "You're already using a low-emission transport method — great choice!"}`;
  }

  if (containsAny(msg, ["energy", "electric", "ac"])) {
    const acMessage = context.assessment.energy.acHoursPerDay > 4 ? `With ${context.assessment.energy.acHoursPerDay} hours of daily AC usage, reducing by even 1-2 hours could save hundreds of kg CO₂e annually.` : "Your energy usage is moderate. Focus on efficient appliances and LED lighting for further savings.";
    return `Your home energy use contributes ${context.score.breakdown.energy.toLocaleString()} kg CO₂e/year. ${acMessage}`;
  }

  if (containsAny(msg, ["food", "diet", "meat"])) {
    let foodMessage = "Consider incorporating more plant-based meals into your routine.";
    if (context.assessment.food.dietType === "heavy_meat") foodMessage = "Even small reductions in meat consumption can have a big impact. Try starting with one meat-free day per week.";
    else if (context.assessment.food.dietType === "vegan") foodMessage = "Your plant-based diet is one of the most impactful choices — well done!";

    return `Your food choices account for ${context.score.breakdown.food.toLocaleString()} kg CO₂e/year. ${foodMessage}`;
  }

  return `Your sustainability score is **${context.score.score}/100**. I can help you understand your carbon footprint, explain your results, or suggest specific actions to improve. Try asking about your biggest emission sources, how to improve your score, or specific areas like transport, energy, or food!`;
}
