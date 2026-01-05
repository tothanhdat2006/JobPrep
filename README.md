# 🚀 JobPrep - Job Interview Preparation Assistant

<div align="center">

**Master your next interview with AI-powered preparation**

Empowering job seekers through intelligent, personalized study roadmaps and last-minute interview survival guides

</div>

---

## 📖 About The Project

**JobPrep** is an intelligent web application that revolutionizes interview preparation by analyzing the gap between your current skills and job requirements. By using AI technology powered, it creates personalized study roadmaps with adaptive role-based prompting that help you focus on what matters most for passing your next interview.

Instead of spending hours or weeks trying to figure out what to study, JobPrep analyzes your resume against any job description and generates a day-by-day learning plan tailored to your timeline and interview type. Whether you have 2 weeks or 2 days until your interview, JobPrep ensures you're studying the right things in the right order, and if you're completely unprepared, Panic Mode has your back.

### The Problem We Solve

- 😰 Job seekers don't know where to focus their limited preparation time
- 📅 No structured study plan based on available time before interviews
- 🎯 Overwhelming amount of topics with no clear prioritization
- 🚨 Last-minute panic when the interview is tomorrow and you haven't prepared
- 👔 Different interviewers (HR vs Tech Lead vs CEO) require different preparation strategies

### Our Solution

JobPrep uses powerful Gemini AI with intelligent role-based prompting to compare your background with job requirements, identifying critical gaps and creating actionable daily study plans. The system adapts to your interview type, whether you're facing HR, a technical team, or the CEO, and provides targeted preparation strategies.

For those critical last-minute scenarios, **Panic Mode** generates an emergency cheat sheet highlighting only the most critical information you need to survive the interview. The focus is on learning the jargon, concepts, and talking points needed to pass interviews. This pragmatic approach maximizes your success rate while respecting your time constraints.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI-Powered Gap Analysis** | Upload resume and job description; let Gemini AI identify critical skill gaps and opportunities |
| 🎭 **Adaptive Role Prompting** | AI customizes preparation based on interviewer type (HR, Technical, Lead, CTO, CEO, or Mixed Panel) |
| 🚨 **Panic Mode** | Last-minute interview survival guide with critical gaps, quick wins, must-know topics, and downloadable cheat sheet |
| 📚 **Dual Learning Modes** | Choose between "Interview Prep" for upcoming interviews or "Learning Mode" for building foundational knowledge |
| 🗓️ **Customizable Roadmaps** | Generate 1-14 day study plans tailored to your interview timeline and preparation needs |
| 📝 **Daily Task Breakdown** | Receive structured daily tasks with time estimates, priorities, and clear objectives |
| ✅ **Progress Tracking** | Check off completed tasks, save your progress, and visualize your preparation journey |
| 📄 **PDF Upload Support** | Directly upload resume and JD as PDF files with automatic text extraction |
| 💾 **Roadmap Management** | Save, load, and manage multiple roadmaps for different job applications |
| 🔐 **Google Authentication** | Secure sign-in with Firebase Google OAuth |
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

### Database & Auth
- **[SQLite](https://www.sqlite.org/)** - Lightweight, serverless SQL database
- **[SQLAlchemy](https://www.sqlalchemy.org/)** (v2.0) - Python SQL toolkit and ORM
- **[Firebase Authentication](https://firebase.google.com/products/auth)** - Secure Google OAuth integration

### Development Tools
- **[uv](https://github.com/astral-sh/uv)** - Ultra-fast Python package installer
- **[Uvicorn](https://www.uvicorn.org/)** - ASGI server for FastAPI

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.10 or higher
- **Node.js** v18 or higher
- **npm** or **yarn** package manager
- Google Gemini API key ([Get one here](https://aistudio.google.com/api-keys))
- Firebase project with Google Authentication enabled

### Installation

#### Backend Setup

1. **Navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Install uv (ultra-fast package installer)**
   ```bash
   pip install uv
   ```

3. **Create virtual environment and install dependencies**
   
   **Windows:**
   ```bash
   setup_venv.bat
   ```
   
   **Linux/Mac:**
   ```bash
   chmod +x setup_venv.sh
   ./setup_venv.sh
   ```
   
   **Or manually:**
   ```bash
   uv venv
   source .venv/bin/activate  # Linux/Mac
   .venv\Scripts\activate     # Windows
   uv pip install -r requirements.txt
   ```

4. **Set up environment variables**
   
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

3. **Set up Firebase**
   
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Google Authentication:
     - Go to Authentication → Sign-in method
     - Enable Google provider
     - Add support email
   - Get your Firebase configuration from Project Settings
   
   Create a `.env` file in `frontend/` directory:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   
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

1. **Sign In with Google**
   - Visit the application
   - Click "Sign in with Google"
   - Authorize the application

2. **Upload Your Materials**
   - Paste or upload your resume (PDF supported)
   - Paste or upload the target job description (PDF supported)
   - Select days until interview (3-14 days)

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
    │   ├── firebase.js            # Firebase configuration
    │   ├── components/
    │   │   ├── Header.jsx         # Navigation header
    │   │   ├── ProtectedRoute.jsx # Route protection wrapper
    │   │   ├── RoadmapDisplay.jsx # Roadmap visualization
    │   │   ├── TaskDetailModal.jsx# Task detail viewer
    │   │   ├── UserProfile.jsx    # User profile management
    │   │   └── MarkdownRenderer.jsx# Markdown content renderer
    │   ├── context/
    │   │   └── AuthContext.jsx    # Authentication state management
    │   ├── pages/
    │   │   ├── SignIn.jsx         # Google sign-in page
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
| `VITE_FIREBASE_API_KEY` | Firebase API key | `AIza...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `your-project-id` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `project.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID | `123456789` |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | `1:123:web:abc` |
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |

---

## 🆘 Troubleshooting

### Common Issues

**Issue: Firebase authentication fails with `auth/operation-not-allowed`**
- Solution: Enable Google sign-in provider in Firebase Console → Authentication → Sign-in method**Issue: Backend fails with `GOOGLE_API_KEY not found`**
- Solution: Create `.env` file in `backend/` with your Gemini API key

**Issue: Frontend can't connect to backend**
- Solution: Ensure backend is running on port 8000 and `VITE_API_URL` is correct

**Issue: CORS errors**
- Solution: Check `FRONTEND_URL` in backend `.env` matches your frontend URL

**Issue: PDF upload fails**
- Solution: Ensure file is a valid PDF and under size limit

**Issue: Module import errors (frontend)**
- Solution: Delete `node_modules` and `package-lock.json`, then run `npm install`

**Issue: Panic Mode not generating**
- Solution: Ensure both resume and JD are provided; check backend logs for AI generation errors

**Issue: Roadmap not saving**
- Solution: Check that you're signed in with Google; verify database permissions

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
- 🔥 [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
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
