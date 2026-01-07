import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const getUser = async (googleId) => {
  const response = await api.get(`/users/${googleId}`);
  return response.data;
};

export const analyzeGap = async (resumeText, jdText, preparationDays, interviewMode = 'interview', interviewerType = 'technical', learningStyle = 'theory_code') => {
  const response = await api.post('/analyze_gap', {
    resume_text: resumeText,
    jd_text: jdText,
    preparation_days: preparationDays,
    interview_mode: interviewMode,
    interviewer_type: interviewerType,
    learning_style: learningStyle,
  });
  return response.data;
};

export const parsePDF = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post('/parse_pdf', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const generateTopicContent = async (resumeText, jdText, topic, taskType, learningStyle, gapAnalysis) => {
  const response = await api.post('/generate_topic_content', {
    resume_text: resumeText,
    jd_text: jdText,
    topic: topic,
    task_type: taskType,
    learning_style: learningStyle,
    gap_analysis: gapAnalysis,
  });
  return response.data;
};

export const generatePanicMode = async (resumeText, jdText, interviewMode = 'interview', interviewerType = 'technical') => {
  const response = await api.post('/panic_mode', {
    resume_text: resumeText,
    jd_text: jdText,
    interview_mode: interviewMode,
    interviewer_type: interviewerType
  });
  return response.data;
};

export default api;
