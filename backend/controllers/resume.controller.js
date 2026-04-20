const Resume = require('../models/Resume');

// @desc    Get all resumes for the logged in user
// @route   GET /api/resumes
// @access  Private
const getResumes = async (req, res, next) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.status(200).json(resumes);
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single resume by ID
// @route   GET /api/resumes/:id
// @access  Private
const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    // Make sure the logged in user matches the resume user
    if (resume.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    res.status(200).json(resume);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new resume
// @route   POST /api/resumes
// @access  Private
const createResume = async (req, res, next) => {
  try {
    const resume = await Resume.create({
      ...req.body,
      user: req.user.id,
    });
    
    res.status(201).json(resume);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a resume
// @route   PUT /api/resumes/:id
// @access  Private
const updateResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    // Make sure the logged in user matches the resume user
    if (resume.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    const updatedResume = await Resume.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedResume);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    // Make sure the logged in user matches the resume user
    if (resume.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    await resume.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Resume deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume
};
