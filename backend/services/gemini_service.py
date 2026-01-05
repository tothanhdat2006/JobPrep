import google.generativeai as genai
import os
import json
from dotenv import load_dotenv
from schemas import AnalyzeGapResponse, GapAnalysis, DayRoadmap, DailyTask, PanicModeResponse, MustKnowTopic

load_dotenv()

# Configure Google Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")

genai.configure(api_key=GOOGLE_API_KEY)


def get_interview_context(interview_mode: str = "interview", interviewer_type: str = "technical") -> str:
    """
    Generate interview context description based on mode and interviewer type.
    
    Args:
        interview_mode: Either "learn" or "interview"
        interviewer_type: One of "hr", "technical", "lead", "cto", "ceo", "mixed"
    
    Returns:
        Formatted context string for AI prompt
    """
    if interview_mode == "learn":
        return """The candidate wants to LEARN and build foundational knowledge before applying for this role.
Focus on:
- Building core competencies from scratch
- Understanding fundamental concepts deeply
- Practical projects to build a portfolio
- Self-assessment and skill validation
"""
    
    interviewer_contexts = {
        "hr": """The candidate will be interviewed by HR/Recruiter.
Focus on:
- Behavioral questions and STAR method responses
- Company culture fit and soft skills
- Communication and presentation skills
- Resume talking points and achievements
- Salary negotiation preparation
""",
        "technical": """The candidate will be interviewed by Developers/Engineers.
Focus on:
- Technical skills and coding problems
- Data structures and algorithms
- System design basics
- Code quality and best practices
- Technology stack specific knowledge
""",
        "lead": """The candidate will be interviewed by a Tech Lead/Engineering Manager.
Focus on:
- System design and architecture
- Team collaboration and leadership
- Project management and delivery
- Technical decision-making
- Scalability and performance considerations
""",
        "cto": """The candidate will be interviewed by the CTO.
Focus on:
- High-level architecture and technical strategy
- Technology choices and trade-offs
- Innovation and technical vision
- Cross-functional collaboration
- Long-term technical planning
""",
        "ceo": """The candidate will be interviewed by the CEO/Founder.
Focus on:
- Business impact and value creation
- Strategic thinking and vision alignment
- Company culture and values fit
- Growth mindset and adaptability
- Leadership potential and initiative
""",
        "mixed": """The candidate will face a panel interview with multiple interviewers.
Focus on:
- Well-rounded preparation across all areas
- Adaptability to different question styles
- Communication with diverse stakeholders
- Balanced technical and soft skills
- Handling pressure and multiple perspectives
"""
    }
    
    return interviewer_contexts.get(interviewer_type, interviewer_contexts["technical"])


async def analyze_gap_with_gemini(
    resume_text: str, 
    jd_text: str, 
    preparation_days: int,
    interview_mode: str = "interview",
    interviewer_type: str = "technical"
) -> AnalyzeGapResponse:
    """
    Use Google Gemini to analyze the gap between resume and job description.
    Returns structured roadmap data.
    """
    # Get interview context using the reusable function
    mode_context = get_interview_context(interview_mode, interviewer_type)
    
    system_prompt = f"""You are an expert tech recruiter and career coach. Analyze the candidate's resume against the job description.

PREPARATION CONTEXT:
{mode_context}

Your task:
1. Calculate a match percentage (0-100) based on skills, experience, and requirements alignment
2. Identify CRITICAL gaps (dealbreakers that could eliminate the candidate)
3. Identify PARTIAL skills (areas where the candidate has some but not complete expertise)
4. Create a {preparation_days}-day study roadmap focused on the preparation context above

IMPORTANT RULES:
- Tailor tasks to the specific preparation context (learning vs interview type)
- Focus on jargon, concepts, and interview talking points, NOT full mastery
- Prioritize skills that will come up in the specific interview context
- Each day should have 3-5 tasks
- Tasks should be concrete and actionable
- Task types: "Read", "Build", "Code", "Practice"
- Include realistic time estimates

Resume:
{resume_text}

Job Description:
{jd_text}

Return ONLY valid JSON in this exact format:
{{
  "match_percentage": 75,
  "gap_analysis": {{
    "critical_gaps": ["List of critical missing skills"],
    "partial_skills": ["List of partially known skills"]
  }},
  "daily_roadmap": [
    {{
      "day": 1,
      "title": "Day title",
      "focus": "Main focus area",
      "tasks": [
        {{
          "task": "Task description",
          "type": "Read",
          "duration": "2 hours",
          "completed": false
        }}
      ]
    }}
  ],
  "summary": "Brief 2-3 sentence summary of preparation strategy"
}}"""

    try:
        # Use Gemini Flash model
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        response = model.generate_content(
            system_prompt,
            generation_config={
                'temperature': 0.7,
                'top_p': 0.95,
                'top_k': 40,
                'max_output_tokens': 8192,
            }
        )
        
        # Extract and parse JSON response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith('```json'):
            response_text = response_text[7:]
        if response_text.startswith('```'):
            response_text = response_text[3:]
        if response_text.endswith('```'):
            response_text = response_text[:-3]
        
        response_text = response_text.strip()
        
        # Parse JSON
        result_dict = json.loads(response_text)
        
        # Validate and create response object
        gap_analysis = GapAnalysis(
            critical_gaps=result_dict["gap_analysis"]["critical_gaps"],
            partial_skills=result_dict["gap_analysis"]["partial_skills"]
        )
        
        daily_roadmap = []
        for day_data in result_dict["daily_roadmap"]:
            tasks = [DailyTask(**task) for task in day_data["tasks"]]
            day_roadmap = DayRoadmap(
                day=day_data["day"],
                title=day_data["title"],
                focus=day_data["focus"],
                tasks=tasks
            )
            daily_roadmap.append(day_roadmap)
        
        return AnalyzeGapResponse(
            match_percentage=result_dict["match_percentage"],
            gap_analysis=gap_analysis,
            daily_roadmap=daily_roadmap,
            summary=result_dict["summary"]
        )
        
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse Gemini response as JSON: {str(e)}")
    except Exception as e:
        raise Exception(f"Error calling Gemini API: {str(e)}")


async def generate_topic_content_with_gemini(
    resume_text: str,
    jd_text: str,
    topic: str,
    task_type: str,
    learning_style: str,
    gap_analysis: GapAnalysis
) -> str:
    """
    Generate personalized learning content for a specific topic using Gemini AI.
    Tailored to the user's learning style and background.
    """
    
    # Create learning style instructions
    style_instructions = {
        "visual": "Use diagrams descriptions, flowcharts, mind maps, and visual analogies. Include ASCII art or describe visual representations when helpful.",
        "practical": "Focus on hands-on examples, code snippets, real-world applications, and step-by-step tutorials. Include practical exercises.",
        "theoretical": "Provide in-depth explanations, underlying principles, academic concepts, and comprehensive theory. Include references to documentation.",
        "balanced": "Mix theory with practical examples, include both conceptual explanations and hands-on demonstrations."
    }
    
    style_instruction = style_instructions.get(learning_style, style_instructions["balanced"])
    
    # Summarize user's background
    critical_gaps_summary = ", ".join(gap_analysis.critical_gaps[:3]) if gap_analysis.critical_gaps else "None identified"
    partial_skills_summary = ", ".join(gap_analysis.partial_skills[:3]) if gap_analysis.partial_skills else "None identified"
    
    system_prompt = f"""You are an expert technical instructor helping a job candidate prepare for an interview.

CANDIDATE'S BACKGROUND:
Resume Summary: {resume_text[:500]}...
Target Job: {jd_text[:300]}...

KNOWLEDGE GAPS:
- Critical gaps: {critical_gaps_summary}
- Areas to strengthen: {partial_skills_summary}

CURRENT TOPIC: {topic}
TASK TYPE: {task_type}

LEARNING STYLE: {learning_style}
Instructions: {style_instruction}

Generate educational content (300-500 words) that:
1. Explains the topic clearly in context of the job requirements
2. Connects to what the candidate already knows
3. Highlights what interviewers typically ask about this topic
4. Provides actionable takeaways for interview preparation
5. Matches the {learning_style} learning style

Keep the tone encouraging and practical. Focus on interview readiness, not full mastery. Limit in 300-500 words
"""

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        response = model.generate_content(
            system_prompt,
            generation_config={
                'temperature': 0.8,
                'top_p': 0.95,
                'top_k': 40,
                'max_output_tokens': 8192,
            }
        )
        
        return response.text.strip()
        
    except Exception as e:
        raise Exception(f"Error generating topic content: {str(e)}")


async def generate_panic_mode_with_gemini(
    resume_text: str, 
    jd_text: str,
    interview_mode: str = "interview",
    interviewer_type: str = "technical"
) -> PanicModeResponse:
    """
    Generate a last-minute interview cheat sheet for candidates with limited time.
    Focus on critical gaps, quick wins, and survival tips.
    """
    # Get interview context using the reusable function
    mode_context = get_interview_context(interview_mode, interviewer_type)
    
    system_prompt = f"""You are an expert interview coach helping a candidate prepare for a LAST-MINUTE interview.

INTERVIEW CONTEXT: {mode_context}

The candidate has very limited time. Generate an emergency cheat sheet focusing on:

1. CRITICAL GAPS (2-4 items): Dealbreakers they MUST address or have talking points for
2. QUICK WINS (2-4 items): Strong points from their resume to confidently highlight
3. MUST-KNOW TOPICS (3-5 topics): Each with concise talking points they can memorize
4. SURVIVAL TIPS (3-5 tips): Practical interview advice specific to the interview context
5. TALKING POINTS (3-5 points): How to discuss their experience confidently

Resume:
{resume_text}

Job Description:
{jd_text}

Return ONLY valid JSON in this exact format:
{{
  "critical_gaps": ["Gap 1", "Gap 2"],
  "quick_wins": ["Win 1", "Win 2"],
  "must_know_topics": [
    {{
      "topic": "Topic Name",
      "why": "Why it's important",
      "key_points": "**Key Points:**\\n- Point 1\\n- Point 2\\n\\n**Example:** Brief example"
    }}
  ],
  "survival_tips": ["Tip 1", "Tip 2"],
  "talking_points": ["Point 1", "Point 2"]
}}

Keep talking points concise and interview-ready. Use markdown formatting for readability.
"""

    try:
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(system_prompt)
        
        json_text = response.text.strip()
        if json_text.startswith('```json'):
            json_text = json_text[7:]
        if json_text.endswith('```'):
            json_text = json_text[:-3]
        json_text = json_text.strip()
        
        data = json.loads(json_text)
        
        must_know_topics = [
            MustKnowTopic(
                topic=topic["topic"],
                why=topic.get("why", ""),
                key_points=topic["key_points"]
            ) for topic in data["must_know_topics"]
        ]
        
        return PanicModeResponse(
            critical_gaps=data["critical_gaps"],
            quick_wins=data["quick_wins"],
            must_know_topics=must_know_topics,
            survival_tips=data["survival_tips"],
            talking_points=data["talking_points"]
        )
        
    except json.JSONDecodeError as e:
        raise Exception(f"Failed to parse Gemini response as JSON: {str(e)}")
    except Exception as e:
        raise Exception(f"Gemini API error: {str(e)}")

