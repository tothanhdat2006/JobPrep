import { useState } from 'react';
import { ArrowLeft, Upload, FileText, AlertCircle, Calendar, Target } from 'lucide-react';
import Header from '../components/Header';

const YourRoadmap = ({ user, onSignOut, onLoadProgress, onBack }) => {
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImportProgress = async (file) => {
    if (!file) return;

    try {
      const text = await file.text();
      const progressData = JSON.parse(text);
      
      // Validate the imported data
      if (!progressData.roadmapData || !progressData.version) {
        setError('Invalid progress file format');
        return;
      }

      // Load the progress
      onLoadProgress(progressData);
      setError(null);
    } catch (err) {
      setError('Failed to import progress file. Please check the file format.');
      console.error('Import error:', err);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleImportProgress(file);
    e.target.value = ''; // Reset input
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/json') {
      handleImportProgress(file);
    } else {
      setError('Please drop a valid JSON file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <Header user={user} onSignOut={onSignOut} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Your Roadmap</h1>
          <p className="text-slate-600">
            Import your saved progress to continue your learning journey
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Import Section */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Import Your Progress
          </h2>

          {/* Drag & Drop Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`border-2 border-dashed rounded-xl p-12 transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
            }`}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="bg-blue-100 p-4 rounded-full">
                <Upload size={40} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Drop your progress file here
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  or click the button below to browse
                </p>
              </div>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-md hover:shadow-lg flex items-center gap-2">
                  <FileText size={18} />
                  Choose JSON File
                </div>
              </label>
            </div>
          </div>

          {/* Information Section */}
          <div className="mt-8 grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-start gap-3">
                <Calendar className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">
                    Continue Your Progress
                  </h4>
                  <p className="text-sm text-slate-600">
                    Import your saved roadmap to pick up exactly where you left off
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-slate-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-start gap-3">
                <Target className="text-green-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">
                    All Data Preserved
                  </h4>
                  <p className="text-sm text-slate-600">
                    Your notes, completed tasks, and AI content are all restored
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* How to Use */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
              <span>💡</span> How to Use
            </h4>
            <ul className="text-sm text-amber-800 space-y-1 ml-6 list-disc">
              <li>Download your progress using the "Download JSON" button in your active roadmap</li>
              <li>Import the saved file here to restore your complete progress</li>
              <li>All your completed tasks, notes, and AI-generated content will be restored</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default YourRoadmap;
