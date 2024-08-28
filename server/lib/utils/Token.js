import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookies = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.SECRET_JWT, {
    expiresIn: '15d',
  });

  res.cookie('jwt', token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // prevent XSS attacks
    sameSite: 'None', // prevent CSRF attacks
    secure: true, // only set secure flag in production
    path: '/', // ensure the path is set correctly
  });

};
