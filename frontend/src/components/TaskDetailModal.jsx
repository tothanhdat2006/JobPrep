import { 
  X, 
  StickyNote, 
  Sparkles, 
  Loader2,
  BookOpen,
  Code,
  Hammer,
  Target
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

const TaskDetailModal = ({ 
  task, 
  taskId,
  dayNumber,
  isOpen, 
  onClose,
  note,
  onNoteChange,
  aiContent,
  isGeneratingAI,
  onGenerateAI,
  learningStyle
}) => {
  if (!isOpen) return null;

  const getTaskIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'read':
        return <BookOpen size={20} className="text-blue-600" />;
      case 'code':
        return <Code size={20} className="text-green-600" />;
      case 'build':
        return <Hammer size={20} className="text-orange-600" />;
      case 'practice':
        return <Target size={20} className="text-purple-600" />;
      default:
        return <BookOpen size={20} className="text-blue-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'read':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'code':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'build':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'practice':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              {getTaskIcon(task.type)}
            </div>
            <div>
              <div className="text-sm text-blue-100">Day {dayNumber}</div>
              <div className="text-white font-semibold text-lg">Task Details</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="p-6 space-y-6">
            {/* Topic Section */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className={`px-3 py-1 rounded-full border-2 text-sm font-semibold ${getTypeColor(task.type)}`}>
                  {task.type.toUpperCase()}
                </div>
                <span className="text-sm text-slate-500">• {task.duration}</span>
              </div>
              <div className="bg-slate-50 border-l-4 border-blue-600 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-slate-800 mb-1">📚 Topic</h3>
                <p className="text-slate-700 leading-relaxed">{task.task}</p>
              </div>
            </section>

            {/* Notes Section */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <StickyNote size={20} className="text-amber-600" />
                <h3 className="text-lg font-semibold text-slate-800">Your Notes</h3>
              </div>
              <textarea
                value={note || ''}
                onChange={(e) => onNoteChange(e.target.value)}
                placeholder="Add your notes, questions, or key takeaways here...&#10;&#10;Example:&#10;• Important concepts to remember&#10;• Questions to research further&#10;• Personal insights"
                className="w-full h-48 px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm transition"
              />
              <p className="text-xs text-slate-500 mt-2">
                💡 Tip: Use this space to track your learning progress and questions
              </p>
            </section>

            {/* AI Learning Assistant Section */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={20} className="text-purple-600" />
                  <h3 className="text-lg font-semibold text-slate-800">AI Learning Assistant</h3>
                </div>
                {aiContent && (
                  <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-full border border-purple-200">
                    {learningStyle} style
                  </span>
                )}
              </div>

              {!aiContent && !isGeneratingAI && (
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="bg-purple-100 p-4 rounded-full">
                      <Sparkles size={32} className="text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-2">
                        Get Personalized Learning Content
                      </h4>
                      <p className="text-sm text-slate-600 mb-4 max-w-md">
                        Generate AI-powered content tailored to your learning style ({learningStyle}) 
                        and interview preparation needs
                      </p>
                      <button
                        onClick={onGenerateAI}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                      >
                        <Sparkles size={18} />
                        Generate Content
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {isGeneratingAI && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-8">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-purple-600" size={40} />
                    <div className="text-center">
                      <h4 className="font-semibold text-slate-800 mb-2">
                        Generating Your Content...
                      </h4>
                      <p className="text-sm text-slate-600">
                        Analyzing your background and creating personalized learning material
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {aiContent && !isGeneratingAI && (
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-5">
                    <MarkdownRenderer content={aiContent} />
                  </div>
                  <button
                    onClick={onGenerateAI}
                    disabled={isGeneratingAI}
                    className="w-full px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-medium rounded-lg transition-all border-2 border-purple-200 hover:border-purple-300 flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} />
                    Regenerate Content
                  </button>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>

      {/* Custom Styles for Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TaskDetailModal;
