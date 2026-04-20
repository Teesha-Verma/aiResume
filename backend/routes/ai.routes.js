const express = require('express');
const router = express.Router();
const { 
  generateSummary, 
  improveBulletPoints, 
  suggestSkills, 
  generateFullResume, 
  getRecommendations 
} = require('../controllers/ai.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/generate-summary', generateSummary);
router.post('/improve-bullets', improveBulletPoints);
router.post('/suggest-skills', suggestSkills);
router.post('/generate-full', generateFullResume);
router.post('/recommendations', getRecommendations);

module.exports = router;
