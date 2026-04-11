import os
import json
import re

try:
    import google.generativeai as genai
except ImportError:
    genai = None

class GeminiService:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.environ.get('GEMINI_API_KEY') or os.environ.get('OPENAI_API_KEY', '')
        self.client_configured = False
        if self.api_key and genai:
            genai.configure(api_key=self.api_key)
            self.client_configured = True

    def generate_expansion(self, idea_text, prompt=None):
        """Expand a business idea using Gemini. Falls back to a heuristic if no key."""
        if not self.client_configured:
            return self._fallback_expansion(idea_text)
        try:
            model = genai.GenerativeModel(
                "gemini-1.5-flash",
                system_instruction=(
                    "You are an expert startup advisor. Analyze the business idea and provide: "
                    "1) A brief market analysis, 2) Key strengths, 3) Potential risks, "
                    "4) Recommended next steps. Be concise and data-driven. "
                    "If the idea is vague, still provide useful analysis by inferring "
                    "the most likely intent and suggesting how to develop it further."
                )
            )
            response = model.generate_content(f"Analyze this startup idea: {idea_text}")
            return response.text.strip()
        except Exception as e:
            return self._fallback_expansion(idea_text)

    def generate_detailed_analysis(self, idea_text):
        """Return structured JSON analysis for the idea using Gemini."""
        if not self.client_configured:
            return self._fallback_detailed(idea_text)
        try:
            model = genai.GenerativeModel(
                "gemini-1.5-flash",
                system_instruction=(
                    "You are an expert startup evaluator. Return ONLY valid JSON with these keys: "
                    "innovation (0-100 integer), market_demand (0-100 integer), scalability (0-100 integer), "
                    "risk_level (Low/Medium/High string), competitive_advantage (string), "
                    "target_audience (string), monetization (string), "
                    "strengths (array of strings), weaknesses (array of strings), "
                    "recommendations (array of strings), "
                    "summary (a 2-3 sentence executive summary of the idea's potential), "
                    "refined_idea (if the idea is vague, suggest a clearer, more detailed version; otherwise repeat the original), "
                    "idea_clarity (Low/Medium/High — how clear and well-defined the idea is). "
                    "No markdown, no explanation — just the JSON object. "
                    "Even if the idea is vague or short, provide your best analysis."
                ),
                generation_config={"response_mime_type": "application/json"}
            )
            response = model.generate_content(f"Evaluate: {idea_text}")
            raw = response.text.strip()
            if raw.startswith("```"):
                raw = raw.split("\n", 1)[-1].rsplit("```", 1)[0]
            return json.loads(raw)
        except Exception:
            return self._fallback_detailed(idea_text)

    def generate_summary(self, idea_text, score, idea_quality, detected_sector, detailed):
        """Generate an executive summary combining all analysis data."""
        if self.client_configured:
            try:
                model = genai.GenerativeModel(
                    "gemini-1.5-flash",
                    system_instruction=(
                        "Write a 2-3 sentence executive summary of this startup idea analysis. "
                        "Be professional and constructive. Mention the overall score, sector, and key insight."
                    )
                )
                prompt_text = (
                    f"Idea: {idea_text}\nScore: {score}/10\n"
                    f"Sector: {detected_sector}\nQuality: {idea_quality}"
                )
                response = model.generate_content(prompt_text)
                return response.text.strip()
            except Exception:
                pass
        return self._fallback_summary(idea_text, score, idea_quality, detected_sector, detailed)

    # ── Fallback heuristics (no API key) ──────────────────

    @staticmethod
    def _fallback_summary(idea_text, score, idea_quality, detected_sector, detailed):
        """Generate a fallback executive summary based on score data."""
        words = idea_text.split()
        # Extract a short name from the idea
        idea_name = ' '.join(words[:6]).rstrip('.,!?') + ('...' if len(words) > 6 else '')

        if score >= 8:
            verdict = 'shows exceptional potential with strong market alignment and innovation signals'
        elif score >= 6:
            verdict = 'demonstrates solid potential with room for strategic improvements'
        elif score >= 4:
            verdict = 'has moderate potential but needs significant development in key areas'
        else:
            verdict = 'is in its early conceptual stage and would benefit from further development'

        quality_note = ''
        if idea_quality in ('Vague', 'Basic'):
            quality_note = (
                f" The description was classified as '{idea_quality}' — "
                f"adding more detail about your target market, unique approach, and execution strategy "
                f"would significantly improve the analysis accuracy."
            )

        return (
            f'Your idea "{idea_name}" scored {score}/10 and {verdict}. '
            f'It falls under the {detected_sector} sector. '
            f'{quality_note}'
        ).strip()

    @staticmethod
    def _fallback_expansion(idea_text):
        words = idea_text.lower().split()
        word_count = len(words)

        # Detect domain hints for more tailored output
        domains = {
            'food': 'food & delivery', 'health': 'healthcare', 'finance': 'fintech',
            'education': 'edtech', 'ai': 'artificial intelligence', 'app': 'mobile application',
            'e-commerce': 'e-commerce', 'shop': 'retail', 'fitness': 'health & fitness',
            'social': 'social media', 'game': 'gaming', 'travel': 'travel tech',
            'real': 'real estate', 'farm': 'agriculture', 'green': 'sustainability',
            'crypto': 'cryptocurrency', 'blockchain': 'blockchain', 'delivery': 'logistics',
        }

        detected_domain = 'technology'
        for word in words:
            if word in domains:
                detected_domain = domains[word]
                break

        if word_count < 10:
            return (
                f"Market Analysis: Even from this brief description, we can identify "
                f"a concept in the {detected_domain} space. This market segment is growing "
                f"with increasing demand for innovative solutions.\n\n"
                f"Key Strengths: The {detected_domain} sector offers strong growth potential. "
                f"Early-stage concepts have the advantage of pivoting quickly based on market signals.\n\n"
                f"Potential Risks: The idea needs more definition to assess specific risks. "
                f"Competition in {detected_domain} is significant, and without a clear differentiator, "
                f"market entry could be challenging.\n\n"
                f"Next Steps: 1) Define your target customer segment precisely. "
                f"2) Identify 2-3 key problems you solve better than alternatives. "
                f"3) Research existing competitors and their weaknesses. "
                f"4) Draft a one-page business model canvas. "
                f"5) Conduct 10+ customer discovery interviews."
            )
        else:
            return (
                f"Market Analysis: This idea addresses a growing market segment in {detected_domain} "
                f"with significant potential. The concept described in {word_count} words shows promise "
                f"for disruption and scalable growth.\n\n"
                f"Key Strengths: Novel approach to {detected_domain}, potentially scalable model, "
                f"and clear value proposition. The market timing appears favorable.\n\n"
                f"Potential Risks: Market competition, execution complexity, funding requirements, "
                f"and the need for product-market fit validation.\n\n"
                f"Next Steps: 1) Validate with target customers through discovery interviews. "
                f"2) Build MVP focusing on the core value proposition. "
                f"3) Seek seed funding or bootstrap with early revenue. "
                f"4) Establish 2-3 strategic partnerships in {detected_domain}. "
                f"5) Set up analytics to measure key engagement metrics."
            )

    @staticmethod
    def _fallback_detailed(idea_text):
        import hashlib
        h = int(hashlib.md5(idea_text.encode()).hexdigest(), 16)
        words = idea_text.lower().split()
        word_count = len(words)

        has_tech = bool(set(words) & {'ai', 'ml', 'blockchain', 'iot', 'automation', 'algorithm', 'smart', 'neural', 'data'})
        has_market = bool(set(words) & {'market', 'customer', 'revenue', 'growth', 'scale', 'platform', 'saas', 'b2b', 'subscription'})

        base_inn = 40 if word_count < 10 else 55
        base_demand = 35 if word_count < 10 else 50
        base_scale = 30 if word_count < 10 else 45

        innovation_val = min(base_inn + (h % 30) + (15 if has_tech else 0), 100)
        demand_val = min(base_demand + (h % 35) + (15 if has_market else 0), 100)
        scale_val = min(base_scale + (h % 40) + (10 if has_tech else 0), 100)

        risk = 'High' if word_count < 10 else ('Medium' if word_count < 30 else ['Low', 'Medium', 'Medium'][h % 3])
        clarity = 'Low' if word_count < 8 else ('Medium' if word_count < 30 else 'High')

        refined = (
            f"{idea_text.strip().rstrip('.')}. "
            f"This concept could be developed as a platform that solves specific pain points "
            f"for targeted users, leveraging technology for automation and scale. "
            f"Consider defining the target audience, key differentiators, and revenue model."
        ) if word_count < 15 else idea_text

        if word_count < 10:
            summary = (
                "This is an early-stage concept that needs further development. "
                "While the core idea has potential, adding detail about target users, "
                "unique approach, and market opportunity would enable a much stronger analysis."
            )
            comp_adv = "To be determined — the concept needs more definition to identify unique advantages."
            target = "Not yet specified — defining a clear target audience is a critical next step."
            monetization = "Revenue model not specified — consider subscription, freemium, marketplace, or transactional models."
            strengths = [
                "Early stage allows for maximum flexibility and pivoting",
                "Concept can be shaped to match market demand",
                "Low initial investment needed to validate",
            ]
            weaknesses = [
                "Idea needs significantly more detail for accurate evaluation",
                "No target audience defined yet",
                "Revenue model not yet specified",
                "Competitive landscape not addressed",
            ]
            recommendations = [
                "Expand the idea description to 3-4 detailed sentences",
                "Identify your specific target customer segment",
                "Define what makes your approach unique",
                "Research top 3 existing competitors in this space",
                "Create a simple revenue model hypothesis",
                "Conduct at least 10 customer discovery interviews",
            ]
        else:
            summary = (
                f"This idea demonstrates {'strong' if innovation_val > 70 else 'moderate'} innovation "
                f"potential with {'promising' if demand_val > 60 else 'developing'} market demand signals. "
                f"{'The concept is well-articulated and shows clear market awareness.' if has_market else 'Adding market context would strengthen the proposition.'}"
            )
            comp_adv = "Unique approach with differentiated value proposition in its target market"
            target = "Tech-savvy professionals and early adopters in the target demographic"
            monetization = "SaaS subscription model with freemium tier for user acquisition"
            strengths = [
                "Innovative concept with growth potential",
                "Scalable architecture possibilities",
                "Clear market need identified",
            ]
            weaknesses = [
                "Early stage — needs market validation",
                "Requires investment for development",
                "Competitive landscape needs analysis",
            ]
            recommendations = [
                "Conduct customer discovery interviews with target users",
                "Build a minimum viable product (MVP)",
                "Establish key partnerships in the industry",
                "Set up metrics tracking from day one",
                "Create a go-to-market strategy document",
            ]

        return {
            "innovation": innovation_val,
            "market_demand": demand_val,
            "scalability": scale_val,
            "risk_level": risk,
            "competitive_advantage": comp_adv,
            "target_audience": target,
            "monetization": monetization,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "recommendations": recommendations,
            "summary": summary,
            "refined_idea": refined,
            "idea_clarity": clarity,
        }
