# 🚀 JobPrep - Job Interview Preparation Assistant

<div align="center">

**Master your next interview with AI-powered preparation**

Empowering job seekers through intelligent, personalized study roadmaps and last-minute interview survival guides

</div>

---

## 📖 About The Project

**JobPrep** aims to answer a critical question: **Why are recent graduate students unemployed?**

**Why are recent graduate students unemployed?** Many students struggle to find employment not because they lack foundational knowledge, but because they haven't developed the specific skills and techstacks companies are looking for.

**Why do they lack these specific skills?** Each company has different techstack demands, lead to the fact that students face lots of of job posting asking for different technology combinations. Without knowing which companies they'll interview with, it's nearly impossible to predict which skills to prioritize.

**Why don't they know what to prioritize?** Students can't objectively evaluate whether their skills meet company standards. This uncertainty leads to either over-preparation for irrelevant skills or dangerous under-preparation for critical requirements.

**Why can't they identify this gap accurately?** Manual resume-to-job comparison is time-intensive, inconsistent, imprecise, and doesn't produce actionable study plans.

**So what's the root cause?** Students lack a tool to automatically analyze the gap between their skills and job requirements, then transform that analysis into personalized, actionable preparation plans. They need something that understands their unique situation and their timeline, who's interviewing them, and what they already know and guides them step-by-step toward a successful interview.

### The Solution: JobPrep

**JobPrep** is an AI-powered interview preparation platform designed to address these challenges. The system helps students in two common scenarios:

1. **📚 Already Learned, But Lack Confidence** - Students have studied the required skills/techstack but need structured review to build confidence and ensure interview readiness

2. **⚡ Haven't Learned, Need Rapid Acquisition** - Students haven't been exposed to the specific skills/techstack the company requires and need to learn them quickly before the interview

**How JobPrep Works:**

Upload your resume and target job description, and our Gemini AI analyzes the gap between your background and job requirements. The system then generates:

- **Skill Categorization**: 
  - ✅ **Strengths to leverage** - What you already know well
  - ⚠️ **Partial knowledge needing review** - Skills you've learned but need to refresh
  - 🚨 **Critical gaps requiring immediate learning** - New skills/techstacks you must acquire

- **Personalized Study Roadmaps**: Day-by-day learning plans (1-14 days) tailored to your timeline and interview type

- **Adaptive Role Prompting**: Customized preparation based on who's interviewing you (HR, Technical, Tech Lead, CTO, CEO, or Mixed Panel)

- **Panic Mode**: For those "interview is tomorrow" moments - an emergency cheat sheet with critical gaps, quick wins, must-know topics, and survival tips

Whether you need to **review and reinforce** existing knowledge or **learn from scratch** under time pressure, JobPrep adapts to your situation, ensuring you study the right things in the right order to maximize your interview success rate.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Powered Gap Analysis** | Upload resume and job description; let Gemini AI identify critical skill gaps and opportunities |
| 🎭 **Adaptive Role Prompting** | AI customizes preparation based on interviewer type (HR, Technical, Lead, CTO, CEO, or Mixed Panel) |
| 🚨 **Panic Mode** | Last-minute interview survival guide with critical gaps, quick wins, must-know topics, and downloadable cheat sheet |
| 📚 **Dual Learning Modes** | Choose between "Interview Prep" for upcoming interviews or "Learning Mode" for building foundational knowledge |
| 🗓️ **Customizable Roadmaps** | Generate 1-14 day study plans tailored to your interview timeline and preparation needs |
| 🎯 **Priority-Based Learning** | Focus on dealbreaker skills first, then strengthen partial knowledge areas |
| 📥 **Export Options** | Download panic mode cheat sheets and study plans for offline review |

---

## 🏗️ Tech Stack

### Frontend
- **[React](https://react.dev/)** (v19.2) - Modern UI library with hooks and functional components
- **[Vite](https://vitejs.dev/)** (v7.2) - Lightning-fast build tool and dev server
- **[React Router](https://reactrouter.com/)** (v6.22) - Client-side routing and navigation
- **[Tailwind CSS](https://tailwindcss.com/)** (v3.4) - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Beautiful, customizable SVG icons
- **[Axios](https://axios-http.com/)** - Promise-based HTTP client

### Backend & AI
- **[FastAPI](https://fastapi.tiangolo.com/)** (v0.109) - Modern, high-performance Python web framework
- **[Google Gemini](https://deepmind.google/technologies/gemini/)** (v2.5 Flash) - Advanced AI for intelligent gap analysis

### Database & AI
- **[SQLite](https://www.sqlite.org/)** - Lightweight, serverless SQL database
- **[SQLAlchemy](https://www.sqlalchemy.org/)** (v2.0) - Python SQL toolkit and ORM

### Development Tools
- **[Uvicorn](https://www.uvicorn.org/)** - ASGI server for FastAPI

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.10 or higher
- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- Google Gemini API key ([Get one here](https://ai.google.dev/))

### Quick Start (Automated Setup)

For the easiest setup, run the automated setup script:

**Windows:**
```bash
setup.bat
```

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

The script will automatically:
1. Check for Python and Node.js
2. Ask for your Google AI Studio API key
3. Create Python virtual environment
4. Install all dependencies (backend and frontend)
5. Configure environment variables
6. Start both servers

### Manual Installation

If you prefer to set up manually:

#### Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment and install dependencies**
   
   **Windows:**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```
   
   **Linux/Mac:**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   
   Create a `.env` file in `backend/` directory:
   ```env
   # Google Gemini API Key
   # Get this from https://ai.google.dev/
   GOOGLE_API_KEY=your_gemini_api_key_here
   
   # Database configuration
   DATABASE_URL=sqlite:///./jobprep.db
   
   # Frontend URL for CORS
   FRONTEND_URL=http://localhost:5173
   ```

5. **Run the backend server**
   ```bash
   python main.py
   ```
   
   Or with uvicorn:
   ```bash
   uvicorn main:app --reload
   ```

   The API will be available at `http://localhost:8000`

#### Frontend Setup

1. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in `frontend/` directory:
   ```env
   # Backend API URL
   VITE_API_URL=http://localhost:8000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

---

## 📚 Usage Guide

### For Job Seekers

1. **Access the Application**
   - Run the setup script or start the servers manually
   - Open http://localhost:5173 in your browser
   - You'll be taken directly to the main dashboard

2. **Upload Your Materials**
   - Paste or upload your resume (PDF or TXT supported)
   - Paste or upload the target job description (PDF or TXT supported)
   - Select days until interview (1-30 days)

3. **Choose Your Preparation Mode**
   
   **Interview Mode:**
   - Select when you have an upcoming interview
   - Choose your interviewer type:
     - **HR/Recruiter** - Focus on behavioral questions, STAR method, company culture fit
     - **Technical** - Emphasize coding problems, algorithms, technical stack knowledge
     - **Tech Lead** - System design, architecture, team collaboration
     - **CTO** - High-level architecture, technical strategy, innovation
     - **CEO/Founder** - Business impact, strategic thinking, culture alignment
     - **Mixed Panel** - Well-rounded preparation for multiple interviewer types
   
   **Learning Mode:**
   - Select when you want to build foundational knowledge before applying
   - Get comprehensive learning paths focused on skill development
   - Build a portfolio and practical project recommendations

4. **Generate Your Roadmap**
   - Click "Generate Roadmap" for a full study plan
   - OR click "Panic Mode" for last-minute preparation (when the interview is tomorrow!)
   - Wait for AI analysis (typically 10-30 seconds)

5. **Follow Your Study Plan**
   - View your match percentage score
   - Review critical gaps vs. partial skills
   - Follow the day-by-day study plan
   - Check off tasks as you complete them
   - Track overall progress
   - Save your roadmap for later reference

6. **Panic Mode (Emergency Preparation)**
   - Generate when you need immediate, focused prep
   - Get critical gaps to address first
   - Quick wins to mention in the interview
   - Must-know topics with key talking points
   - Interview survival tips
   - Download as TXT cheat sheet for printing/review

7. **Manage Your Roadmaps**
   - Save progress on current roadmap
   - Load previously saved roadmaps
   - Track multiple job applications separately

---

## 📁 Project Structure

```
JobPrep/
├── backend/
│   ├── main.py                    # FastAPI application entry point
│   ├── schemas.py                 # Pydantic models for validation
│   ├── database.py                # SQLAlchemy setup and models
│   ├── requirements.txt           # Python dependencies
│   ├── setup_venv.bat             # Windows setup script
│   ├── setup_venv.sh              # Linux/Mac setup script
│   ├── .env.example               # Environment variables template
│   ├── services/
│       ├── gemini_service.py      # Google Gemini AI integration with role prompting
│       └── pdf_service.py         # PDF text extraction
│
└── frontend/
    ├── src/
    │   ├── App.jsx                # Main app with routing
    │   ├── components/
    │   │   ├── Header.jsx         # Navigation header
    │   │   ├── ProtectedRoute.jsx # Route wrapper (no auth)
    │   │   ├── RoadmapDisplay.jsx # Roadmap visualization
    │   │   ├── TaskDetailModal.jsx# Task detail viewer
    │   │   └── MarkdownRenderer.jsx# Markdown content renderer
    │   ├── context/
    │   │   └── AuthContext.jsx    # Context setup (no auth)
    │   ├── pages/
    │   │   ├── Dashboard.jsx      # Main input/upload page with mode selection
    │   │   ├── YourRoadmap.jsx    # Saved roadmaps manager
    │   │   └── PanicMode.jsx      # Emergency preparation cheat sheet
    │   └── services/
    │       └── api.js             # API service layer
    ├── public/
    ├── index.html
    ├── package.json
    ├── tailwind.config.js         # Tailwind CSS configuration
    ├── postcss.config.js          # PostCSS configuration
    ├── vite.config.js             # Vite configuration
    └── .env.example               # Environment variables template
```

---


## 🔐 Environment Configuration

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `GOOGLE_API_KEY` | Google Gemini API key | `AIza...` |
| `DATABASE_URL` | SQLite database path | `sqlite:///./jobprep.db` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

---

## 🆘 Troubleshooting

### Common Issues

**Issue: Backend fails with `GOOGLE_API_KEY not found`**
- Solution: Create `.env` file in `backend/` with your Google Gemini API key from https://ai.google.dev/

**Issue: Frontend can't connect to backend**
- Solution: Ensure backend is running on port 8000 and `VITE_API_URL` is correct in frontend `.env`

**Issue: CORS errors**
- Solution: Check `FRONTEND_URL` in backend `.env` matches your frontend URL (http://localhost:5173)

**Issue: PDF upload fails**
- Solution: Ensure file is a valid PDF or TXT and under size limit

**Issue: Module import errors (frontend)**
- Solution: Delete `node_modules` and `package-lock.json`, then run `npm install`

**Issue: Panic Mode not generating**
- Solution: Ensure both resume and JD are provided; check backend logs for AI generation errors

**Issue: Roadmap not saving**
- Solution: Verify the file system has write permissions; check browser console for errors

**Issue: Setup script fails on Windows**
- Solution: Run PowerShell as Administrator; ensure Python and Node.js are in your system PATH

**Issue: Python virtual environment activation fails**
- Solution: On Windows, use `.venv\Scripts\activate.bat`; on Linux/Mac, use `source .venv/bin/activate`

---
## 🎯 Feature Deep Dive

### Adaptive Role Prompting

JobPrep's AI adapts its analysis and recommendations based on who will be interviewing you:

- **HR/Recruiter**: Focuses on behavioral questions, STAR method responses, culture fit, and soft skills
- **Technical (Developers/Engineers)**: Emphasizes coding problems, algorithms, system design basics, and tech stack knowledge
- **Tech Lead**: Covers system architecture, team collaboration, project management, and technical leadership
- **CTO**: Highlights high-level architecture, technical strategy, innovation, and cross-functional collaboration
- **CEO/Founder**: Focuses on business impact, strategic thinking, vision alignment, and leadership potential
- **Mixed Panel**: Provides well-rounded preparation balancing all areas for diverse interviewer perspectives

### Panic Mode

When you're unprepared and the interview is tomorrow, Panic Mode generates a focused survival guide:

- **Critical Gaps**: Top dealbreakers you must address immediately
- **Quick Wins**: Strengths from your background to emphasize
- **Must-Know Topics**: Essential concepts with "why it matters" and key talking points
- **Survival Tips**: Interview-specific strategies for your situation
- **Talking Points**: Ready-to-use statements from your experience
- **Downloadable Cheat Sheet**: Print-friendly TXT format for last-minute review

### Learning Mode vs Interview Mode

**Interview Mode**: Optimized for candidates with an upcoming interview
- Focuses on interview-passing strategies
- Emphasizes talking points and jargon
- Prioritizes breadth over depth
- Time-boxed daily plans

**Learning Mode**: Designed for skill-building before applying
- Comprehensive foundational knowledge
- Practical projects and portfolio building
- In-depth understanding of concepts
- Self-assessment and validation milestones

---
## 🤖 AI Usage

This project uses **Gemini 3.0 Pro** to:
- Design prompts

**Claude Sonnet 4.5** for:
- Code generation with careful framework selection
- Feature implementation

We manually review for code/suggestion before using

---

## 🔗 Useful Resources

- 📖 [React Documentation](https://react.dev/)
- ⚡ [Vite Documentation](https://vitejs.dev/)
- 🚀 [FastAPI Documentation](https://fastapi.tiangolo.com/)
- 🎨 [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- 🤖 [Google Gemini API Docs](https://ai.google.dev/docs)

---

## 📧 Contact & Support

- **Project Repository**: [JobPrep on GitHub](https://github.com/tothanhdat2006/JobPrep)
- **Report Issues**: [GitHub Issues](https://github.com/tothanhdat2006/JobPrep/issues)

---


<div align="center">

**Made with ❤️ to help job seekers succeed in their interviews**

⭐ Star this repo if you find it helpful!

</div>
