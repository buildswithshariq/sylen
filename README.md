# EcoPilot

**EcoPilot** is an intelligent, beautifully designed carbon footprint tracking and reduction platform. It bridges the gap between environmental awareness and actionable behavioral change by providing users with a highly polished, interactive dashboard, deterministic carbon math, and personalized AI coaching.

---

## 🌍 Chosen Vertical
**Climate Tech / Sustainability**

We chose this vertical because addressing climate change requires individual action alongside systemic change. However, carbon footprint calculators are often dense, visually unappealing, and overly technical. EcoPilot solves this by wrapping rigorous environmental math into a premium, gamified, and highly accessible user experience.

---

## 🛠️ Approach & Logic
Our approach prioritizes both **mathematical accuracy** and **user experience**:
- **Modern Tech Stack**: Built with Next.js (App Router), React, and Tailwind CSS for a fast, responsive, mobile-first experience.
- **Premium UI/UX**: Uses Framer Motion for fluid micro-animations, glassmorphism for depth, and an Apple-inspired spatial layout.
- **Deterministic Engine**: Core emissions calculations are pure, deterministic functions (`carbonCalculator.ts`) that rely on established EPA and DEFRA emission factors.
- **Predictive Scenarios**: A robust "What-If" simulation engine isolates and calculates the exact emission impact of specific lifestyle changes (e.g., "Switch to a vegan diet" or "Buy an electric vehicle") in real-time.
- **Secure AI Coaching**: Integrates Google Gemini models securely via Next.js server-side API routes, providing personalized, encouraging, and context-aware advice based directly on the user's assessment data.

---

## 🚀 How the Solution Works

1. **Interactive Assessment**: Users complete a streamlined, 4-step assessment covering Transport, Energy, Food, and Lifestyle habits.
2. **Deterministic Calculation**: Behind the scenes, user inputs are cross-referenced with emission factor constants to calculate an exact annual footprint in kg CO₂e.
3. **Dashboard Visualization**: Results are presented on a visually stunning dashboard featuring an animated score ring, category breakdown, and gamified "Eco Levels".
4. **AI Sustainability Coach**: A conversational AI interface interprets the user's unique footprint and offers specific, actionable tips to reduce emissions.
5. **What-If Simulator**: Users can dynamically toggle various sustainability scenarios (e.g., "Recycle Everything") to see exactly how their score and total emissions would improve if they adopted those habits.

---

## 📏 Assumptions Made
To keep the assessment accessible while maintaining scientific validity, the following assumptions and averages were utilized:
- **Grid Emissions**: Uses a US average grid emission factor of `0.42 kg CO₂e per kWh`. Localized grid variations (e.g., high renewable grids vs. coal-heavy grids) are abstracted for simplicity.
- **Flight Emissions**: Assumes an average of `250 kg CO₂e` per flight trip (a blend of short/medium haul).
- **Diet Baselines**: Diet emissions are generalized into broad categories (Vegan, Vegetarian, Mixed, Heavy Meat) with standard base emission values.
- **Simulation Adherence**: Projected reductions in the What-If Simulator assume that the user strictly adheres to the selected scenario for a full year.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Set up your environment variables
# Copy .env.example to .env.local and add your Google Gemini API key
cp .env.example .env.local

# Run the development server
npm run dev

# Run unit tests
npm run test
```

## 📄 License
MIT
