import { useState, useEffect } from 'react';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Code, 
  Award,
  Mail,
  Phone,
  MapPin,
  Plus,
  Trash2,
  Save,
  X
} from 'lucide-react';
import './UserProfile.css';

const UserProfile = ({ user, onUseProfile, onClose }) => {
  const [profileData, setProfileData] = useState({
    personalInfo: {
      name: user?.displayName || '',
      email: user?.email || '',
      phone: '',
      location: '',
      summary: ''
    },
    education: [
      {
        id: Date.now(),
        degree: '',
        major: '',
        university: '',
        gpa: '',
        graduationDate: '',
        achievements: ''
      }
    ],
    experience: [
      {
        id: Date.now(),
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }
    ],
    projects: [
      {
        id: Date.now(),
        name: '',
        description: '',
        technologies: '',
        link: ''
      }
    ],
    skills: {
      technical: '',
      soft: '',
      languages: '',
      tools: ''
    }
  });

  useEffect(() => {
    // Load saved profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    alert('Profile saved successfully!');
  };

  const handleUseAsResume = () => {
    const resumeText = generateResumeText(profileData);
    onUseProfile(resumeText);
    onClose();
  };

  const generateResumeText = (data) => {
    let text = '';
    
    // Personal Info
    text += `${data.personalInfo.name}\n`;
    text += `${data.personalInfo.email} | ${data.personalInfo.phone} | ${data.personalInfo.location}\n\n`;
    if (data.personalInfo.summary) {
      text += `PROFESSIONAL SUMMARY\n${data.personalInfo.summary}\n\n`;
    }

    // Education
    if (data.education.length > 0 && data.education[0].degree) {
      text += `EDUCATION\n`;
      data.education.forEach(edu => {
        if (edu.degree) {
          text += `${edu.degree} in ${edu.major}\n`;
          text += `${edu.university}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}\n`;
          text += `${edu.graduationDate}\n`;
          if (edu.achievements) text += `${edu.achievements}\n`;
          text += `\n`;
        }
      });
    }

    // Experience
    if (data.experience.length > 0 && data.experience[0].title) {
      text += `WORK EXPERIENCE\n`;
      data.experience.forEach(exp => {
        if (exp.title) {
          text += `${exp.title} at ${exp.company}\n`;
          text += `${exp.location} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
          text += `${exp.description}\n\n`;
        }
      });
    }

    // Projects
    if (data.projects.length > 0 && data.projects[0].name) {
      text += `PROJECTS\n`;
      data.projects.forEach(proj => {
        if (proj.name) {
          text += `${proj.name}\n`;
          text += `${proj.description}\n`;
          text += `Technologies: ${proj.technologies}\n`;
          if (proj.link) text += `Link: ${proj.link}\n`;
          text += `\n`;
        }
      });
    }

    // Skills
    if (data.skills.technical || data.skills.soft || data.skills.languages || data.skills.tools) {
      text += `SKILLS\n`;
      if (data.skills.technical) text += `Technical: ${data.skills.technical}\n`;
      if (data.skills.tools) text += `Tools & Frameworks: ${data.skills.tools}\n`;
      if (data.skills.languages) text += `Languages: ${data.skills.languages}\n`;
      if (data.skills.soft) text += `Soft Skills: ${data.skills.soft}\n`;
    }

    return text;
  };

  const addEducation = () => {
    setProfileData({
      ...profileData,
      education: [...profileData.education, {
        id: Date.now(),
        degree: '',
        major: '',
        university: '',
        gpa: '',
        graduationDate: '',
        achievements: ''
      }]
    });
  };

  const removeEducation = (id) => {
    setProfileData({
      ...profileData,
      education: profileData.education.filter(edu => edu.id !== id)
    });
  };

  const updateEducation = (id, field, value) => {
    setProfileData({
      ...profileData,
      education: profileData.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const addExperience = () => {
    setProfileData({
      ...profileData,
      experience: [...profileData.experience, {
        id: Date.now(),
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    });
  };

  const removeExperience = (id) => {
    setProfileData({
      ...profileData,
      experience: profileData.experience.filter(exp => exp.id !== id)
    });
  };

  const updateExperience = (id, field, value) => {
    setProfileData({
      ...profileData,
      experience: profileData.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const addProject = () => {
    setProfileData({
      ...profileData,
      projects: [...profileData.projects, {
        id: Date.now(),
        name: '',
        description: '',
        technologies: '',
        link: ''
      }]
    });
  };

  const removeProject = (id) => {
    setProfileData({
      ...profileData,
      projects: profileData.projects.filter(proj => proj.id !== id)
    });
  };

  const updateProject = (id, field, value) => {
    setProfileData({
      ...profileData,
      projects: profileData.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto profile-modal-backdrop">
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl profile-modal-container">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 rounded-t-xl flex justify-between items-center profile-header">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <User size={28} />
              My Profile
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-500 p-2 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-8 space-y-8">
            {/* Personal Information */}
            <section className="profile-section">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <User className="text-blue-600" size={20} />
                Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileData.personalInfo.name}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      personalInfo: { ...profileData.personalInfo, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Mail size={14} /> Email
                  </label>
                  <input
                    type="email"
                    value={profileData.personalInfo.email}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      personalInfo: { ...profileData.personalInfo, email: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <Phone size={14} /> Phone
                  </label>
                  <input
                    type="tel"
                    value={profileData.personalInfo.phone}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      personalInfo: { ...profileData.personalInfo, phone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                    <MapPin size={14} /> Location
                  </label>
                  <input
                    type="text"
                    value={profileData.personalInfo.location}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      personalInfo: { ...profileData.personalInfo, location: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-1">Professional Summary</label>
                <textarea
                  value={profileData.personalInfo.summary}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    personalInfo: { ...profileData.personalInfo, summary: e.target.value }
                  })}
                  rows="3"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief summary of your professional background and goals..."
                />
              </div>
            </section>

            {/* Education */}
            <section className="profile-section">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <GraduationCap className="text-blue-600" size={20} />
                  Education
                </h3>
                <button
                  onClick={addEducation}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                >
                  <Plus size={16} />
                  Add Education
                </button>
              </div>
              {profileData.education.map((edu, index) => (
                <div key={edu.id} className="mb-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-slate-700">Education {index + 1}</h4>
                    {profileData.education.length > 1 && (
                      <button
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="e.g., Bachelor of Science"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Major</label>
                      <input
                        type="text"
                        value={edu.major}
                        onChange={(e) => updateEducation(edu.id, 'major', e.target.value)}
                        placeholder="e.g., Computer Science"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">University</label>
                      <input
                        type="text"
                        value={edu.university}
                        onChange={(e) => updateEducation(edu.id, 'university', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">GPA</label>
                      <input
                        type="text"
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                        placeholder="e.g., 3.8/4.0"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Graduation Date</label>
                      <input
                        type="text"
                        value={edu.graduationDate}
                        onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                        placeholder="e.g., May 2024"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Achievements</label>
                      <input
                        type="text"
                        value={edu.achievements}
                        onChange={(e) => updateEducation(edu.id, 'achievements', e.target.value)}
                        placeholder="e.g., Dean's List, Honors"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Experience */}
            <section className="profile-section">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <Briefcase className="text-blue-600" size={20} />
                  Work Experience
                </h3>
                <button
                  onClick={addExperience}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                >
                  <Plus size={16} />
                  Add Experience
                </button>
              </div>
              {profileData.experience.map((exp, index) => (
                <div key={exp.id} className="mb-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-slate-700">Experience {index + 1}</h4>
                    {profileData.experience.length > 1 && (
                      <button
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                        placeholder="e.g., Jan 2023"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                        <input
                          type="text"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          placeholder="e.g., Dec 2024"
                          disabled={exp.current}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-slate-100"
                        />
                      </div>
                      <label className="flex items-center gap-2 pb-2">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm text-slate-600">Current</span>
                      </label>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                      rows="3"
                      placeholder="Describe your responsibilities and achievements..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </section>

            {/* Projects */}
            <section className="profile-section">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <Code className="text-blue-600" size={20} />
                  Projects
                </h3>
                <button
                  onClick={addProject}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                >
                  <Plus size={16} />
                  Add Project
                </button>
              </div>
              {profileData.projects.map((proj, index) => (
                <div key={proj.id} className="mb-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-slate-700">Project {index + 1}</h4>
                    {profileData.projects.length > 1 && (
                      <button
                        onClick={() => removeProject(proj.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Technologies Used</label>
                      <input
                        type="text"
                        value={proj.technologies}
                        onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                        placeholder="e.g., React, Node.js, MongoDB"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                      rows="2"
                      placeholder="Describe the project and your contributions..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Project Link (Optional)</label>
                    <input
                      type="url"
                      value={proj.link}
                      onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                      placeholder="https://github.com/username/project"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
            </section>

            {/* Skills */}
            <section className="profile-section">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Award className="text-blue-600" size={20} />
                Skills
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Technical Skills</label>
                  <input
                    type="text"
                    value={profileData.skills.technical}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      skills: { ...profileData.skills, technical: e.target.value }
                    })}
                    placeholder="e.g., JavaScript, Python, Java, C++"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tools & Frameworks</label>
                  <input
                    type="text"
                    value={profileData.skills.tools}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      skills: { ...profileData.skills, tools: e.target.value }
                    })}
                    placeholder="e.g., React, Node.js, Git, Docker"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Languages</label>
                  <input
                    type="text"
                    value={profileData.skills.languages}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      skills: { ...profileData.skills, languages: e.target.value }
                    })}
                    placeholder="e.g., English (Native), Spanish (Fluent)"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Soft Skills</label>
                  <input
                    type="text"
                    value={profileData.skills.soft}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      skills: { ...profileData.skills, soft: e.target.value }
                    })}
                    placeholder="e.g., Leadership, Communication, Problem Solving"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-slate-200">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Profile
              </button>
              <button
                onClick={handleUseAsResume}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <User size={18} />
                Use as Resume
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
