export const generateTokenAndSetCookies = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.SECRET_JWT, {
    expiresIn: '15d',
  });

  res.cookie('jwt', token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
    httpOnly: true, // Prevent XSS attacks
    sameSite: 'strict', // Prevent CSRF attacks
    secure: process.env.NODE_ENV === 'production', // Only set secure flag in production
    path: '/', // Ensure the path is set correctly
  });

  res.status(200).json({ success: true });
};
