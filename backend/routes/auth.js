const express = require('express');
const { requireAuth, getUserFromClerk, requireActiveUser, logUserActivity } = require('../middleware/auth');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);
router.use(getUserFromClerk);
router.use(requireActiveUser);

// Health check for authenticated users
router.get('/health', logUserActivity('auth health check'), (req, res) => {
  res.json({
    success: true,
    message: 'Authentication is working',
    user: {
      id: req.user.id,
      email: req.user.email,
      role: req.user.role
    },
    timestamp: new Date().toISOString()
  });
});

// Get user token info (for debugging)
router.get('/token-info', logUserActivity('get token info'), (req, res) => {
  res.json({
    success: true,
    data: {
      userId: req.auth?.userId,
      sessionId: req.auth?.sessionId,
      sessionClaims: req.auth?.sessionClaims,
      token: req.auth?.token
    }
  });
});

module.exports = router;
