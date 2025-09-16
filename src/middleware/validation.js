// Simple validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateRegistration = (req, res, next) => {
  const { email, password, name } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!password || !validatePassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters long' });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !validateEmail(email)) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  next();
};

const validateActivityTracking = (req, res, next) => {
  const { userId } = req.body;
  const { courseId } = req.params;

  if (!userId || isNaN(parseInt(userId))) {
    return res.status(400).json({ error: 'Valid userId is required' });
  }

  if (!courseId || isNaN(parseInt(courseId))) {
    return res.status(400).json({ error: 'Valid courseId is required' });
  }

  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateActivityTracking,
  validateEmail,
  validatePassword
};