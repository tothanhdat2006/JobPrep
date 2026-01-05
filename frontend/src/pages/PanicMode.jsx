import { useState } from 'react';
import { 
  ArrowLeft, 
  Zap, 
  Download, 
  Loader2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Lightbulb,
  Brain,
  BookOpen
} from 'lucide-react';
import Header from '../components/Header';
import MarkdownRenderer from '../components/MarkdownRenderer';

const PanicMode = ({ user, onSignOut, onBack, panicData, resumeText, jdText }) => {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const downloadCheatSheet = () => {
    const cheatSheetContent = generateCheatSheetText();
    const blob = new Blob([cheatSheetContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `interview-cheatsheet-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateCheatSheetText = () => {
    let content = '═══════════════════════════════════════════════════════\n';
    content += '          🚨 LAST-MINUTE INTERVIEW CHEAT SHEET 🚨\n';
    content += '═══════════════════════════════════════════════════════\n\n';
    
    content += `📅 Generated: ${new Date().toLocaleString()}\n`;

    content += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    content += '⚠️  CRITICAL GAPS - FOCUS HERE FIRST!\n';
    content += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    panicData.critical_gaps.forEach((gap, idx) => {
      content += `${idx + 1}. ${gap}\n\n`;
    });

    content += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    content += '💡 QUICK WINS - MENTION THESE!\n';
    content += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    panicData.quick_wins.forEach((win, idx) => {
      content += `✓ ${win}\n\n`;
    });

    content += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    content += '🎯 MUST-KNOW TOPICS\n';
    content += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    panicData.must_know_topics.forEach((topic, idx) => {
      content += `\n📌 ${topic.topic}\n`;
      content += `   ${topic.why}\n`;
      content += `   Key Points: ${topic.key_points}\n\n`;
    });

    content += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    content += '🗣️  INTERVIEW SURVIVAL TIPS\n';
    content += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    panicData.survival_tips.forEach((tip, idx) => {
      content += `${idx + 1}. ${tip}\n\n`;
    });

    content += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    content += '🎬 TALKING POINTS FROM YOUR EXPERIENCE\n';
    content += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    panicData.talking_points.forEach((point, idx) => {
      content += `• ${point}\n\n`;
    });

    content += '\n\n═══════════════════════════════════════════════════════\n';
    content += '           💪 YOU\'VE GOT THIS! GOOD LUCK! 💪\n';
    content += '═══════════════════════════════════════════════════════\n';

    return content;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <Header user={user} onSignOut={onSignOut} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Panic Mode Header */}
        <div className="mb-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-10 animate-pulse"></div>
          <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border-4 border-red-500">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Zap className="text-red-600 animate-bounce" size={48} />
              <h1 className="text-4xl font-black text-red-600">PANIC MODE ACTIVATED</h1>
              <Zap className="text-red-600 animate-bounce" size={48} />
            </div>
            <p className="text-lg text-slate-700 mb-2">
              Last-Minute Interview Survival Guide
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>Generated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Download Cheat Sheet Button */}
        <div className="mb-8 text-center">
          <button
            onClick={downloadCheatSheet}
            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 flex items-center gap-3 mx-auto text-lg"
          >
            <Download size={24} />
            Download Cheat Sheet (TXT)
          </button>
          <p className="text-sm text-slate-600 mt-2">Print this and review before your interview!</p>
        </div>

        {/* Critical Gaps - Always Visible */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-xl p-6 mb-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={28} className="animate-pulse" />
            <h2 className="text-2xl font-bold">⚠️ CRITICAL GAPS - Address These First!</h2>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur">
            <ul className="space-y-3">
              {panicData.critical_gaps.map((gap, idx) => (
                <li key={idx} className="flex items-start gap-3 text-lg">
                  <span className="font-bold text-yellow-300 flex-shrink-0">{idx + 1}.</span>
                  <div className="font-medium flex-1">
                    <MarkdownRenderer content={gap} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quick Wins */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border-2 border-green-500">
          <button
            onClick={() => toggleSection('quick_wins')}
            className="w-full p-6 flex items-center justify-between hover:bg-green-50 transition"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-600" size={28} />
              <h2 className="text-2xl font-bold text-slate-800">💡 Quick Wins - Mention These!</h2>
            </div>
            <div className={`transform transition-transform ${expandedSection === 'quick_wins' ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </button>
          {expandedSection === 'quick_wins' && (
            <div className="p-6 pt-0 bg-green-50">
              <ul className="space-y-2">
                {panicData.quick_wins.map((win, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                    <div className="text-slate-700 flex-1">
                      <MarkdownRenderer content={win} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Must-Know Topics */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border-2 border-blue-500">
          <button
            onClick={() => toggleSection('topics')}
            className="w-full p-6 flex items-center justify-between hover:bg-blue-50 transition"
          >
            <div className="flex items-center gap-3">
              <Brain className="text-blue-600" size={28} />
              <h2 className="text-2xl font-bold text-slate-800">🎯 Must-Know Topics</h2>
            </div>
            <div className={`transform transition-transform ${expandedSection === 'topics' ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </button>
          {expandedSection === 'topics' && (
            <div className="p-6 pt-0 bg-blue-50">
              <div className="space-y-4">
                {panicData.must_know_topics.map((topic, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-600">
                    <div className="text-lg font-bold text-slate-800 mb-2">
                      <MarkdownRenderer content={`📌 ${topic.topic}`} />
                    </div>
                    <div className="text-sm text-slate-600 mb-3 italic">
                      <MarkdownRenderer content={topic.why} />
                    </div>
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-sm font-semibold text-blue-900 mb-1">Key Points:</p>
                      <MarkdownRenderer content={topic.key_points} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Survival Tips */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border-2 border-purple-500">
          <button
            onClick={() => toggleSection('tips')}
            className="w-full p-6 flex items-center justify-between hover:bg-purple-50 transition"
          >
            <div className="flex items-center gap-3">
              <Lightbulb className="text-purple-600" size={28} />
              <h2 className="text-2xl font-bold text-slate-800">🗣️ Interview Survival Tips</h2>
            </div>
            <div className={`transform transition-transform ${expandedSection === 'tips' ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </button>
          {expandedSection === 'tips' && (
            <div className="p-6 pt-0 bg-purple-50">
              <ol className="space-y-3">
                {panicData.survival_tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                    <span className="font-bold text-purple-600 flex-shrink-0 text-lg">{idx + 1}.</span>
                    <div className="text-slate-700 flex-1">
                      <MarkdownRenderer content={tip} />
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Talking Points */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 border-2 border-orange-500">
          <button
            onClick={() => toggleSection('talking')}
            className="w-full p-6 flex items-center justify-between hover:bg-orange-50 transition"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="text-orange-600" size={28} />
              <h2 className="text-2xl font-bold text-slate-800">🎬 Talking Points from Your Experience</h2>
            </div>
            <div className={`transform transition-transform ${expandedSection === 'talking' ? 'rotate-180' : ''}`}>
              ▼
            </div>
          </button>
          {expandedSection === 'talking' && (
            <div className="p-6 pt-0 bg-orange-50">
              <ul className="space-y-2">
                {panicData.talking_points.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 bg-white p-4 rounded-lg shadow-sm">
                    <span className="text-orange-600 font-bold flex-shrink-0">•</span>
                    <div className="text-slate-700 flex-1">
                      <MarkdownRenderer content={point} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Motivational Footer */}
        <div className="mt-8 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-xl shadow-2xl p-8 text-center text-white">
          <h3 className="text-3xl font-black mb-3 animate-pulse">🔥 YOU'VE GOT THIS! 🔥</h3>
          <p className="text-lg mb-2">
            Focus on the critical gaps, leverage your quick wins, and stay confident!
          </p>
          <p className="text-sm opacity-90">
            Remember: They invited YOU for a reason. Show them what you've got! 💪
          </p>
        </div>
      </main>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default PanicMode;
