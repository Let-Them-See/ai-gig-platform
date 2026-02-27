const { validationResult } = require("express-validator");

// middleware to check for validation errors after express-validator checks
exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
