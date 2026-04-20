const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'dummy_key',
});

// Helper function to handle mock responses if no actual API key is present
const getMockResponse = (type) => {
  if (type === 'summary') {
    return 'Detailed and experienced professional with a strong track record of delivering high-quality solutions. Proven ability to adapt to new technologies quickly and work effectively within cross-functional teams.';
  } else if (type === 'bullets') {
    return [
      'Spearheaded the development and deployment of scalable web applications, resulting in a 30% increase in user retention.',
      'Collaborated with product teams to translate requirements into robust technical architecture.',
      'Optimized backend services, reducing API response times by over 40%.'
    ].join('\n');
  } else if (type === 'skills') {
    return 'JavaScript, React, Node.js, Express, MongoDB, TypeScript, Docker, Git, Agile Methodologies';
  }
  return '';
};

// @desc    Generate professional summary
// @route   POST /api/ai/generate-summary
// @access  Private
const generateSummary = async (req, res, next) => {
  try {
    const { title, experience, currentSummary } = req.body;
    if (!title && !currentSummary) {
      res.status(400);
      throw new Error('Title or existing summary is required');
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key') {
      return res.status(200).json({ summary: getMockResponse('summary') });
    }

    let prompt = '';
    if (currentSummary && currentSummary.trim().length > 3) {
      prompt = `You are an expert resume writer. I am applying for a "${title || 'professional'}" role. Rewrite and polish my draft summary below to make it highly professional, ATS-friendly, and impactful. 
      CRITICAL INSTRUCTIONS: 
      - Keep it exactly 1 paragraph, around 3-4 concise sentences.
      - Return ONLY the final polished summary paragraph.
      - DO NOT provide multiple options.
      - DO NOT include conversational filler, greetings, or explanations. 
      - Just output the raw text of the summary.
      
      My Draft:
      "${currentSummary}"`;
    } else {
      prompt = `Write a professional resume summary for a ${title}. 
      Consider the following background if provided: ${experience}. 
      CRITICAL INSTRUCTIONS: 
      - Keep it exactly 1 paragraph, concise, impactful, and around 3-4 sentences.
      - Return ONLY the final summary paragraph.
      - DO NOT provide multiple options or conversational text.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let cleanedText = response.text.trim().replace(/\*\*/g, '');
    res.status(200).json({ summary: cleanedText });
  } catch (error) {
    console.error('Gemini Error:', error.message);
    res.status(200).json({ summary: getMockResponse('summary') });
  }
};

// @desc    Improve bullet points
// @route   POST /api/ai/improve-bullets
// @access  Private
const improveBulletPoints = async (req, res, next) => {
  try {
    const { text, role } = req.body;
    if (!text) {
      res.status(400);
      throw new Error('Text is required');
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key') {
      return res.status(200).json({ improvedText: getMockResponse('bullets') });
    }

    const prompt = `Improve the following resume bullet points for a ${role || 'professional'}. Make them more action-oriented, quantifiable, and impactful:\n\n${text}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    let cleanedText = response.text.trim().replace(/\*\*/g, '');
    res.status(200).json({ improvedText: cleanedText });
  } catch (error) {
    console.error('Gemini Error:', error.message);
    res.status(200).json({ improvedText: getMockResponse('bullets') });
  }
};

// @desc    Suggest skills based on role
// @route   POST /api/ai/suggest-skills
// @access  Private
const suggestSkills = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role) {
      res.status(400);
      throw new Error('Role is required');
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key') {
      return res.status(200).json({ skills: getMockResponse('skills') });
    }

    const prompt = `Suggest a comma-separated list of top 10 relevant skills for a ${role} resume. Return only the skills separated by commas without markdown formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.status(200).json({ skills: response.text.trim() });
  } catch (error) {
    console.error('Gemini Error:', error.message);
    res.status(200).json({ skills: getMockResponse('skills') });
  }
};

// @desc    Generate full template resume based on a job role
// @route   POST /api/ai/generate-full
// @access  Private
const generateFullResume = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!role) {
      res.status(400);
      throw new Error('Target role is required to generate a resume');
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key') {
      return res.status(200).json({
        resumeData: {
          personalInfo: { firstName: 'Jane', lastName: 'Doe', summary: `Experienced ${role} with a proven track record.`, email: 'jane.doe@example.com', phone: '123-456-7890', address: 'New York, NY', linkedIn: `linkedin.com/in/janedoe`, github: `github.com/janedoe` },
          experience: [
            { title: `Senior ${role}`, company: 'Tech Corp', startDate: 'Jan 2020', endDate: 'Present', description: '- Led development of scalable microservices\n- Mentored junior engineers\n- Improved system performance by 40%' },
            { title: `${role}`, company: 'Startup Inc', startDate: 'Mar 2017', endDate: 'Dec 2019', description: '- Developed front-end user interfaces\n- Integrated third-party APIs\n- Participated in agile sprints' }
          ],
          education: [{ school: 'State University', degree: 'Bachelor of Science', fieldOfStudy: 'Computer Science', startDate: 'Aug 2013', endDate: 'May 2017' }],
          skills: ['JavaScript', 'React', 'Node.js', 'Problem Solving', 'Agile']
        }
      });
    }

    const prompt = `Generate a realistic, completely filled out professional resume for a "${role}". 
    Return ONLY a valid JSON object matching exactly this structure (no markdown fences, just pure JSON): 
    {
      "personalInfo": { "firstName": "John", "lastName": "Doe", "summary": "...", "email": "john@example.com", "phone": "123-456-7890", "address": "City, State", "linkedIn": "linkedin.com/in/johndoe", "github": "github.com/johndoe" },
      "experience": [ { "title": "...", "company": "...", "startDate": "...", "endDate": "...", "description": "bullet points starting with '- '" } ],
      "education": [ { "school": "...", "degree": "...", "fieldOfStudy": "...", "startDate": "...", "endDate": "..." } ],
      "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6"]
    }
    Provide 2 experience entries and 1 education entry. Ensure descriptions use action verbs.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    try {
      let jsonStr = response.text.trim();
      if(jsonStr.startsWith('```json')) jsonStr = jsonStr.substring(7, jsonStr.length - 3).trim();
      else if(jsonStr.startsWith('```')) jsonStr = jsonStr.substring(3, jsonStr.length - 3).trim();
      res.status(200).json({ resumeData: JSON.parse(jsonStr) });
    } catch(e) {
      console.error('Failed to parse AI JSON:', e);
      res.status(500).json({ message: 'AI returned invalid JSON formatting' });
    }
  } catch (error) {
    console.error('Gemini Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Get recommendations / tips to improve the resume
// @route   POST /api/ai/recommendations
// @access  Private
const getRecommendations = async (req, res, next) => {
  try {
    const { role, resumeData } = req.body;
    if (!role) {
      res.status(400);
      throw new Error('Target role is required');
    }

    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_key') {
      return res.status(200).json({
        recommendations: [
          `Consider getting an AWS or Azure certification for ${role} roles.`,
          "Add metrics to your experience bullet points (e.g., 'increased sales by 20%').",
          "Include a portfolio link directly to your best projects.",
          "Ensure your LinkedIn profile summarizes your recent achievements."
        ]
      });
    }

    const currentSkills = resumeData?.skills?.join(', ') || 'None';
    const experienceCount = resumeData?.experience?.length || 0;

    const prompt = `I am applying for a "${role}" position. I currently have ${experienceCount} jobs listed on my resume and my skills include: ${currentSkills}.
    Suggest 4 actionable recommendations to drastically improve my chances of getting hired. 
    Topics could include certifications to get, types of projects to build, keywords to add, or formatting tips.
    Return the 4 recommendations as a simple JSON array of strings e.g. ["tip 1", "tip 2", "tip 3", "tip 4"]. Do not return markdown fences.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    try {
      let jsonStr = response.text.trim();
      if(jsonStr.startsWith('```json')) jsonStr = jsonStr.substring(7, jsonStr.length - 3).trim();
      else if(jsonStr.startsWith('```')) jsonStr = jsonStr.substring(3, jsonStr.length - 3).trim();
      res.status(200).json({ recommendations: JSON.parse(jsonStr) });
    } catch(e) {
      console.error('Failed to parse AI Recommendations JSON:', e);
      res.status(200).json({ recommendations: ["Add quantifiable achievements to your bullet points.", "Tailor your professional summary to the job description."] });
    }
  } catch (error) {
    console.error('Gemini Error:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  generateSummary,
  improveBulletPoints,
  suggestSkills,
  generateFullResume,
  getRecommendations
};
