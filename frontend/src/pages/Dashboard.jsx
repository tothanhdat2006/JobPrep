import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyzeGap, parsePDF, generatePanicMode } from '../services/api';
import RoadmapDisplay from '../components/RoadmapDisplay';
import Header from '../components/Header';
import UserProfile from '../components/UserProfile';
import YourRoadmap from './YourRoadmap';
import PanicMode from './PanicMode';
import { 
  Upload, 
  FileText, 
  Briefcase, 
  Loader2,
  AlertCircle,
  UserCircle,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [preparationDays, setPreparationDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);
  const [error, setError] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [importedProgress, setImportedProgress] = useState(null);
  const [showYourRoadmap, setShowYourRoadmap] = useState(false);
  const [panicModeData, setPanicModeData] = useState(null);
  const [panicLoading, setPanicLoading] = useState(false);
  const [interviewMode, setInterviewMode] = useState('interview'); // 'learn' or 'interview'
  const [interviewerType, setInterviewerType] = useState('technical');

  const handlePDFUpload = async (e, setTextFunction) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const result = await parsePDF(file);
      setTextFunction(result.text);
    } catch (err) {
      setError('Failed to parse PDF. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!resumeText.trim() || !jdText.trim()) {
      setError('Please provide both resume and job description');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await analyzeGap(
        resumeText, 
        jdText, 
        preparationDays,
        interviewMode,
        interviewMode === 'interview' ? interviewerType : null
      );
      setRoadmapData(result);
    } catch (err) {
      setError('Failed to generate roadmap. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  };

  const handleLoadProgress = (progressData) => {
    // Restore all the data
    setImportedProgress(progressData);
    setRoadmapData(progressData.roadmapData);
    setResumeText(progressData.resumeText || '');
    setJdText(progressData.jdText || '');
    setShowYourRoadmap(false);
  };

  const handlePanicMode = async () => {
    if (!resumeText.trim() || !jdText.trim()) {
      setError('Please provide both resume and job description for panic mode');
      return;
    }

    try {
      setPanicLoading(true);
      setError(null);
      const result = await generatePanicMode(
        resumeText, 
        jdText,
        interviewMode,
        interviewMode === 'interview' ? interviewerType : null
      );
      setPanicModeData(result);
    } catch (err) {
      setError('Failed to generate panic mode cheat sheet. Please try again.');
      console.error(err);
    } finally {
      setPanicLoading(false);
    }
  };

  if (panicModeData) {
    return (
      <PanicMode
        user={user}
        onSignOut={handleSignOut}
        onBack={() => setPanicModeData(null)}
        panicData={panicModeData}
        resumeText={resumeText}
        jdText={jdText}
      />
    );
  }

  if (roadmapData) {
    return (
      <RoadmapDisplay 
        data={roadmapData} 
        onBack={() => {
          setRoadmapData(null);
          setImportedProgress(null);
        }} 
        userName={user?.displayName}
        resumeText={resumeText}
        jdText={jdText}
        savedProgress={importedProgress}
      />
    );
  }

  if (showYourRoadmap) {
    return (
      <YourRoadmap
        user={user}
        onSignOut={handleSignOut}
        onLoadProgress={handleLoadProgress}
        onBack={() => setShowYourRoadmap(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <Header user={user} onSignOut={handleSignOut} onYourRoadmap={() => setShowYourRoadmap(true)} />

      {/* User Profile Modal */}
      {showProfile && (
        <UserProfile
          user={user}
          onUseProfile={(text) => setResumeText(text)}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Create Your Study Roadmap
          </h2>
          <p className="text-slate-600">
            Upload your resume and job description to get a personalized preparation plan
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Resume Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="text-blue-600" size={24} />
                <h3 className="text-lg font-semibold text-slate-800">Resume</h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                  disabled={loading}
                >
                  <UserCircle size={16} />
                  <span className="text-sm font-medium">My Profile</span>
                </button>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handlePDFUpload(e, setResumeText)}
                    className="hidden"
                    disabled={loading}
                  />
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                    <Upload size={16} />
                    <span className="text-sm font-medium">Upload PDF</span>
                  </div>
                </label>
              </div>
            </div>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here or upload a PDF..."
              className="w-full h-64 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              disabled={loading}
            />
          </div>

          {/* Job Description Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="text-blue-600" size={24} />
                <h3 className="text-lg font-semibold text-slate-800">Job Description</h3>
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handlePDFUpload(e, setJdText)}
                  className="hidden"
                  disabled={loading}
                />
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                  <Upload size={16} />
                  <span className="text-sm font-medium">Upload PDF</span>
                </div>
              </label>
            </div>
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the job description here or upload a PDF..."
              className="w-full h-64 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
              disabled={loading}
            />
          </div>
        </div>

        {/* Interview Mode Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Preparation Goal</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => setInterviewMode('learn')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                interviewMode === 'learn'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">📚</div>
                <div>
                  <div className="font-semibold text-slate-800 mb-1">Learn Before Applying</div>
                  <div className="text-sm text-slate-600">
                    Build foundational knowledge and skills before submitting your application
                  </div>
                </div>
              </div>
            </button>
            <button
              onClick={() => setInterviewMode('interview')}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                interviewMode === 'interview'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">🎯</div>
                <div>
                  <div className="font-semibold text-slate-800 mb-1">Prepare for Interview</div>
                  <div className="text-sm text-slate-600">
                    Focused preparation for an upcoming interview with specific focus
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Interviewer Type Selection */}
          {interviewMode === 'interview' && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h4 className="text-md font-semibold text-slate-800 mb-3">Who will interview you?</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { value: 'hr', label: 'HR / Recruiter', icon: '👔', desc: 'Behavioral & culture fit' },
                  { value: 'technical', label: 'Developer / Engineer', icon: '💻', desc: 'Technical skills & coding' },
                  { value: 'lead', label: 'Tech Lead / Manager', icon: '👨‍💼', desc: 'Leadership & system design' },
                  { value: 'cto', label: 'CTO', icon: '🎖️', desc: 'Architecture & strategy' },
                  { value: 'ceo', label: 'CEO / Founder', icon: '🚀', desc: 'Vision & business impact' },
                  { value: 'mixed', label: 'Panel / Mixed', icon: '👥', desc: 'Multiple interviewers' }
                ].map(type => (
                  <button
                    key={type.value}
                    onClick={() => setInterviewerType(type.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      interviewerType === type.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{type.icon}</div>
                    <div className="font-semibold text-sm text-slate-800 mb-0.5">{type.label}</div>
                    <div className="text-xs text-slate-600">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Preparation Days Slider */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Days Until Interview: <span className="text-blue-600">{preparationDays}</span>
          </h3>
          <input
            type="range"
            min="1"
            max="14"
            value={preparationDays}
            onChange={(e) => setPreparationDays(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            disabled={loading}
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>1 days</span>
            <span>14 days</span>
          </div>
        </div>

        {/* Generate Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Panic Mode Button */}
          <button
            onClick={handlePanicMode}
            disabled={panicLoading || !resumeText.trim() || !jdText.trim()}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg transition duration-200 shadow-lg hover:shadow-xl flex items-center gap-3"
          >
            {panicLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Generating...
              </>
            ) : (
              <>
                <Zap size={20} />
                Interview Is Today!
              </>
            )}
          </button>

          {/* Regular Generate Button */}
          <button
            onClick={handleGenerateRoadmap}
            disabled={loading || !resumeText.trim() || !jdText.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg transition duration-200 shadow-lg hover:shadow-xl flex items-center gap-3"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Analyzing...
              </>
            ) : (
              <>
                Generate {preparationDays}-Day Roadmap
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
