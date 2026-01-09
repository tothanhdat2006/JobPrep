import google.generativeai as genai
import os
import json
import logging
from dotenv import load_dotenv
from schemas import AnalyzeGapResponse, GapAnalysis, DayRoadmap, DailyTask, PanicModeResponse, MustKnowTopic

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

load_dotenv()

# Configure Google Gemini API
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in environment variables")

genai.configure(api_key=GOOGLE_API_KEY)


def get_interview_context(interview_mode: str = "interview", interviewer_type: str = "technical", learning_style: str = "theory_code") -> str:
    """
    Generate interview context description based on mode and interviewer type.
    
    Args:
        interview_mode: Either "learn" or "interview"
        interviewer_type: One of "hr", "technical", "lead", "cto", "ceo", "mixed"
        learning_style: For "learn" mode - "project" or "theory_code"
    
    Returns:
        Formatted context string for AI prompt
    """
    if interview_mode == "learn":
        if learning_style == "project":
            return """The candidate wants to LEARN through PROJECT-BASED learning before applying for this role.
Focus on:
- Building real-world projects that demonstrate the required skills
- Hands-on implementation and portfolio development
- Learning by doing with practical applications
- Creating tangible deliverables to showcase
- Iterative building and testing
"""
        else:  # theory_code
            return """The candidate wants to LEARN through THEORY + CODE practice before applying for this role.
Focus on:
- Understanding theoretical foundations first
- Practicing with coding exercises and problems
- Building core competencies through structured learning
- Combining conceptual knowledge with coding practice
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
    interviewer_type: str = "technical",
    learning_style: str = "theory_code"
) -> AnalyzeGapResponse:
    """
    Use Google Gemini to analyze the gap between resume and job description.
    Returns structured roadmap data.
    """
    # Get interview context using the reusable function
    mode_context = get_interview_context(interview_mode, interviewer_type, learning_style)
    
    system_prompt = f"""You are an expert tech recruiter and career coach. Analyze the candidate's resume against the job description.

PREPARATION CONTEXT:
{mode_context}

Your task:
1. Identify CRITICAL gaps (dealbreakers that could eliminate the candidate) - list them in priority order
2. Identify PARTIAL skills (areas where the candidate has some but not complete expertise) - list them in priority order
3. Create a {preparation_days}-day study roadmap focused on the preparation context above

IMPORTANT: Generate all content in ENGLISH, regardless of the language used in the resume or job description.

IMPORTANT RULES FOR TASKS:
- Each task MUST specify which skill gap it addresses
- For each task, include:
  * gap_type: "critical" if addressing critical_gaps, "partial" if addressing partial_skills, null if general
  * gap_index: The 0-based index position in the respective gaps list (e.g., 0 for first critical gap, 1 for second)
- Tailor tasks to the specific preparation context (learning vs interview type)
- Focus on jargon, concepts, and interview talking points, NOT full mastery
- Prioritize critical gaps first, then partial skills
- Each day should have 3-5 tasks
- Tasks should be concrete and actionable
- Task types: "Read", "Build", "Code", "Practice", "Project"
- Include realistic time estimates

Resume:
{resume_text}

Job Description:
{jd_text}

Return ONLY valid JSON in this exact format:
{{
  "gap_analysis": {{
    "critical_gaps": ["Gap 1 (highest priority)", "Gap 2", "Gap 3"],
    "partial_skills": ["Skill 1 (highest priority)", "Skill 2"]
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
          "completed": false,
          "gap_type": "critical",
          "gap_index": 0
        }}
      ]
    }},
    {{
      "day": 2,
      "title": "Day 2 title",
      "focus": "Focus area for day 2",
      "tasks": [
        {{
          "task": "Another task description",
          "type": "Practice",
          "duration": "3 hours",
          "completed": false,
          "gap_type": "partial",
          "gap_index": 0
        }}
      ]
    }}
    ...
  ],
  "summary": "Brief 2-3 sentence summary of preparation strategy"
}}"""

    try:
        # Log request details
        logger.info(f"[GEMINI] Starting gap analysis - Mode: {interview_mode}, Days: {preparation_days}")
        logger.debug(f"[GEMINI] Interviewer Type: {interviewer_type}, Learning Style: {learning_style}")
        logger.debug(f"[GEMINI] Resume length: {len(resume_text)} chars, JD length: {len(jd_text)} chars")
        
        # Use Gemini Flash model
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Configuration - increase max tokens for longer roadmaps
        max_tokens = 16384 if preparation_days > 14 else 8192
        logger.info(f"[GEMINI] Using max_output_tokens: {max_tokens}")
        
        # Configuration
        gen_config = {
            'temperature': 0.7,
            'top_p': 0.95,
            'top_k': 40,
            'max_output_tokens': max_tokens,
        }
        logger.debug(f"[GEMINI] Generation config: {gen_config}")
        
        # Call Gemini API
        logger.info("[GEMINI] Calling Gemini API...")
        response = model.generate_content(
            system_prompt,
            generation_config=gen_config
        )
        
        # Log response metadata
        logger.info(f"[GEMINI] Response received - Candidates: {len(response.candidates) if hasattr(response, 'candidates') else 'N/A'}")
        
        # Track token usage metadata
        if hasattr(response, 'usageMetadata') and response.usageMetadata:
            usage = response.usageMetadata
            logger.info(f"[GEMINI] Token Usage:")
            logger.info(f"  - Prompt tokens: {usage.prompt_token_count if hasattr(usage, 'prompt_token_count') else 'N/A'}")
            logger.info(f"  - Candidates tokens: {usage.candidates_token_count if hasattr(usage, 'candidates_token_count') else 'N/A'}")
            logger.info(f"  - Total tokens: {usage.total_token_count if hasattr(usage, 'total_token_count') else 'N/A'}")
            
            # Additional metadata if available
            if hasattr(usage, 'cached_content_token_count') and usage.cached_content_token_count:
                logger.info(f"  - Cached content tokens: {usage.cached_content_token_count}")
            if hasattr(usage, 'thoughts_token_count') and usage.thoughts_token_count:
                logger.info(f"  - Thoughts tokens: {usage.thoughts_token_count}")
        else:
            logger.warning("[GEMINI] No usageMetadata available in response")
        
        # Extract and parse JSON response
        response_text = response.text.strip()
        logger.debug(f"[GEMINI] Raw response length: {len(response_text)} chars")
        
        # Remove markdown code blocks if present
        if response_text.startswith('```json'):
            response_text = response_text[7:]
        if response_text.startswith('```'):
            response_text = response_text[3:]
        if response_text.endswith('```'):
            response_text = response_text[:-3]
        
        response_text = response_text.strip()
        logger.debug(f"[GEMINI] Cleaned response length: {len(response_text)} chars")
        
        # Parse JSON
        logger.info("[GEMINI] Parsing JSON response...")
        result_dict = json.loads(response_text)
        
        # Log parsed structure
        logger.info(f"[GEMINI] Parsed - Critical gaps: {len(result_dict.get('gap_analysis', {}).get('critical_gaps', []))}, Partial skills: {len(result_dict.get('gap_analysis', {}).get('partial_skills', []))}, Days: {len(result_dict.get('daily_roadmap', []))}")
        
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
        
        logger.info(f"[GEMINI] ✅ Successfully generated {len(daily_roadmap)}-day roadmap")
        return AnalyzeGapResponse(
            gap_analysis=gap_analysis,
            daily_roadmap=daily_roadmap,
            summary=result_dict["summary"]
        )
        
    except json.JSONDecodeError as e:
        logger.error(f"[GEMINI] ❌ JSON Parse Error: {str(e)}")
        logger.error(f"[GEMINI] Response text preview: {response_text[:500]}...")
        raise ValueError(f"Failed to parse Gemini response as JSON: {str(e)}")
    except KeyError as e:
        logger.error(f"[GEMINI] ❌ Missing key in response: {str(e)}")
        logger.error(f"[GEMINI] Available keys: {list(result_dict.keys()) if 'result_dict' in locals() else 'N/A'}")
        raise ValueError(f"Invalid response structure from Gemini: missing {str(e)}")
    except Exception as e:
        logger.error(f"[GEMINI] ❌ Unexpected error: {type(e).__name__}: {str(e)}")
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

IMPORTANT: 
- Generate all content in ENGLISH, regardless of the language used in the resume or job description.
- Do NOT start with phrases like "Great work on...", "Excellent background in...", etc.
- Focus directly on explaining the topic without addressing the candidate personally.
- Do not provide background information, context, or moralizing text. Output only the requested content. 

Generate educational content (300-500 words) that:
1. Explains the topic clearly in context of the job requirements
2. Connects to what the candidate already knows
3. Highlights what interviewers typically ask about this topic
4. Provides actionable takeaways for interview preparation
5. Matches the {learning_style} learning style

Keep the tone encouraging and practical. Focus on interview readiness, not full mastery. Limit in 300-500 words. No yapping.
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
    interviewer_type: str = "technical",
    learning_style: str = "theory_code"
) -> PanicModeResponse:
    """
    Generate a last-minute interview cheat sheet for candidates with limited time.
    Focus on critical gaps, quick wins, and survival tips.
    """
    # Get interview context using the reusable function
    mode_context = get_interview_context(interview_mode, interviewer_type, learning_style)
    
    system_prompt = f"""You are an expert interview coach helping a candidate prepare for a LAST-MINUTE interview.

INTERVIEW CONTEXT: {mode_context}

The candidate has very limited time. Generate an emergency cheat sheet focusing on:

1. CRITICAL GAPS (2-4 items): Dealbreakers they MUST address or have talking points for
2. QUICK WINS (2-4 items): Strong points from their resume to confidently highlight
3. MUST-KNOW TOPICS (3-5 topics): Each with concise talking points they can memorize
4. SURVIVAL TIPS (3-5 tips): Practical interview advice specific to the interview context
5. TALKING POINTS (3-5 points): How to discuss their experience confidently

IMPORTANT: Generate all content in ENGLISH, regardless of the language used in the resume or job description.

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

