import { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ArrowLeft, 
  BookOpen, 
  Code, 
  Hammer, 
  Target,
  TrendingUp,
  AlertTriangle,
  StickyNote,
  Download
} from 'lucide-react';
import { generateTopicContent } from '../services/api';
import TaskDetailModal from './TaskDetailModal';

const RoadmapDisplay = ({ data, onBack, userName, resumeText, jdText, savedProgress }) => {
  const [completedTasks, setCompletedTasks] = useState(savedProgress?.completedTasks ? new Set(savedProgress.completedTasks) : new Set());
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskNotes, setTaskNotes] = useState(savedProgress?.taskNotes || {});
  const [aiContent, setAiContent] = useState(savedProgress?.aiContent || {});
  const [loadingAI, setLoadingAI] = useState({});
  const [learningStyle, setLearningStyle] = useState(savedProgress?.learningStyle || 'balanced');
  const [lastSaved, setLastSaved] = useState(savedProgress?.lastSaved || null);

  const toggleTask = (dayIndex, taskIndex) => {
    const taskId = `${dayIndex}-${taskIndex}`;
    const newCompleted = new Set(completedTasks);
    
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    
    setCompletedTasks(newCompleted);
  };

  const openTaskModal = (dayIndex, taskIndex, task, dayNumber) => {
    const taskId = `${dayIndex}-${taskIndex}`;
    setSelectedTask({ dayIndex, taskIndex, task, taskId, dayNumber });
  };

  const closeTaskModal = () => {
    setSelectedTask(null);
  };

  const updateNote = (taskId, note) => {
    setTaskNotes(prev => ({ ...prev, [taskId]: note }));
  };

  const generateAIContent = async (dayIndex, taskIndex, task) => {
    const taskId = `${dayIndex}-${taskIndex}`;
    
    try {
      setLoadingAI(prev => ({ ...prev, [taskId]: true }));
      
      const result = await generateTopicContent(
        resumeText || '',
        jdText || '',
        task.task,
        task.type,
        learningStyle,
        data.gap_analysis
      );
      
      setAiContent(prev => ({ ...prev, [taskId]: result.content }));
    } catch (err) {
      console.error('Failed to generate AI content:', err);
      setAiContent(prev => ({ ...prev, [taskId]: 'Failed to generate content. Please try again.' }));
    } finally {
      setLoadingAI(prev => ({ ...prev, [taskId]: false }));
    }
  };

  const getTaskIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'read':
        return <BookOpen size={16} className="text-blue-600" />;
      case 'code':
        return <Code size={16} className="text-green-600" />;
      case 'build':
        return <Hammer size={16} className="text-orange-600" />;
      case 'practice':
        return <Target size={16} className="text-purple-600" />;
      case 'project':
        return <Hammer size={16} className="text-indigo-600" />;
      default:
        return <BookOpen size={16} className="text-blue-600" />;
    }
  };

  const getGapBadge = (task) => {
    if (!task.gap_type || task.gap_index === null || task.gap_index === undefined) {
      return null;
    }

    const isCritical = task.gap_type === 'critical';
    const gapList = isCritical ? data.gap_analysis.critical_gaps : data.gap_analysis.partial_skills;
    const gapName = gapList[task.gap_index];
    const position = task.gap_index + 1;
    const totalGaps = gapList.length;

    return (
      <div 
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
          isCritical 
            ? 'bg-red-100 text-red-700 border border-red-200' 
            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
        }`}
        title={gapName}
      >
        <span>{isCritical ? '🚨' : '⚡'}</span>
        <span>
          {isCritical ? 'Critical' : 'Strengthen'} #{position}/{totalGaps}
        </span>
      </div>
    );
  };

  const calculateProgress = () => {
    const totalTasks = data.daily_roadmap.reduce(
      (sum, day) => sum + day.tasks.length,
      0
    );
    return totalTasks > 0 ? Math.round((completedTasks.size / totalTasks) * 100) : 0;
  };

  const saveProgress = () => {
    const progressData = {
      version: '1.0',
      lastSaved: new Date().toISOString(),
      roadmapData: data,
      completedTasks: Array.from(completedTasks),
      taskNotes,
      aiContent,
      learningStyle,
      resumeText,
      jdText,
      userName
    };
    
    setLastSaved(new Date().toISOString());
    return progressData;
  };

  const downloadProgress = () => {
    const progressData = saveProgress();
    const blob = new Blob([JSON.stringify(progressData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roadmap-progress-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1">
                Your Study Roadmap
              </h1>
              <p className="text-slate-600">
                {userName ? `Welcome ${userName}!` : 'Good luck with your preparation!'}
              </p>
              {lastSaved && (
                <p className="text-xs text-slate-500 mt-1">
                  Last saved: {new Date(lastSaved).toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className="flex gap-2">
                <button
                  onClick={downloadProgress}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium shadow-sm hover:shadow"
                >
                  <Download size={18} />
                  Download JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Learning Style Selector */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Learning Style Preference</h3>
          <p className="text-sm text-slate-600 mb-4">
            Choose how you'd like the AI to generate detailed content for each task when you click "View Details". This customizes the explanations and learning materials inside each day's tasks.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { value: 'practical', label: '🛠️ Practical', desc: 'Hands-on examples' },
              { value: 'theoretical', label: '📚 Theoretical', desc: 'In-depth concepts' },
              { value: 'balanced', label: '⚖️ Balanced', desc: 'Mix of all styles' }
            ].map(style => (
              <button
                key={style.value}
                onClick={() => setLearningStyle(style.value)}
                className={`flex-1 min-w-[150px] px-4 py-3 rounded-lg border-2 transition-all ${
                  learningStyle === style.value
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="font-semibold">{style.label}</div>
                <div className="text-xs mt-1 opacity-75">{style.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <TrendingUp className="text-blue-600" size={24} />
            Preparation Strategy
          </h2>
          <p className="text-slate-700 leading-relaxed">{data.summary}</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-slate-800">Overall Progress</h3>
            <span className="text-sm font-semibold text-blue-600">
              {calculateProgress()}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${calculateProgress()}%` }}
            />
          </div>
        </div>

        {/* Gap Analysis */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Critical Gaps */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-600" size={20} />
              Critical Gaps
            </h3>
            <ul className="space-y-2">
              {data.gap_analysis.critical_gaps.map((gap, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-slate-700 bg-red-50 p-3 rounded-lg"
                >
                  <span className="text-red-600 font-bold">•</span>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Partial Skills */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <TrendingUp className="text-yellow-600" size={20} />
              Skills to Strengthen
            </h3>
            <ul className="space-y-2">
              {data.gap_analysis.partial_skills.map((skill, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-slate-700 bg-yellow-50 p-3 rounded-lg"
                >
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Daily Roadmap */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Your {data.daily_roadmap.length}-Day Plan
          </h2>

          {data.daily_roadmap.map((day, dayIndex) => (
            <div key={dayIndex} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-1">Day {day.day}</h3>
                    <p className="text-blue-100 font-medium">{day.title}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-100">Focus Area</div>
                    <div className="text-lg font-semibold">{day.focus}</div>
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div className="p-6">
                <div className="space-y-3">
                  {day.tasks.map((task, taskIndex) => {
                    const taskId = `${dayIndex}-${taskIndex}`;
                    const isCompleted = completedTasks.has(taskId);

                    return (
                      <div
                        key={taskIndex}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isCompleted
                            ? 'bg-green-50 border-green-200'
                            : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div 
                            className="pt-1 cursor-pointer"
                            onClick={() => toggleTask(dayIndex, taskIndex)}
                          >
                            {isCompleted ? (
                              <CheckCircle2
                                size={24}
                                className="text-green-600"
                              />
                            ) : (
                              <Circle size={24} className="text-slate-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                {getTaskIcon(task.type)}
                                <span className="text-sm font-semibold text-slate-600 uppercase">
                                  {task.type}
                                </span>
                                {getGapBadge(task)}
                                <span className="text-sm text-slate-500">
                                  • {task.duration}
                                </span>
                              </div>
                              <button
                                onClick={() => openTaskModal(dayIndex, taskIndex, task, day.day)}
                                className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium shadow-sm hover:shadow"
                              >
                                <StickyNote size={16} />
                                View Details
                              </button>
                            </div>
                            <p
                              className={`text-slate-800 ${
                                isCompleted ? 'line-through text-slate-500' : ''
                              }`}
                            >
                              {task.task}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Motivational Footer */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">You've Got This! 💪</h3>
          <p className="text-blue-100">
            Stay focused, follow the plan, and ace that interview!
          </p>
        </div>
      </main>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask.task}
          taskId={selectedTask.taskId}
          dayNumber={selectedTask.dayNumber}
          isOpen={!!selectedTask}
          onClose={closeTaskModal}
          note={taskNotes[selectedTask.taskId]}
          onNoteChange={(note) => updateNote(selectedTask.taskId, note)}
          aiContent={aiContent[selectedTask.taskId]}
          isGeneratingAI={loadingAI[selectedTask.taskId]}
          onGenerateAI={() => generateAIContent(selectedTask.dayIndex, selectedTask.taskIndex, selectedTask.task)}
          learningStyle={learningStyle}
        />
      )}
    </div>
  );
};

export default RoadmapDisplay;
