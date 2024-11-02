export const roleCheck = (role) => (req, res, next) => {
  const user = req.user;
  if (user.role === role) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized user" });
};
