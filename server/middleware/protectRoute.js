import jwt from 'jsonwebtoken';

const protectRoute = (req, res, next) => {
  const token = req.cookies.jwt; // Extract JWT from cookies

  if (!token) {
    return res.status(401).json({ error: 'No JWT token found' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    req.user = decoded; // Attach decoded user data to request object
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired JWT token' });
  }
};

export default protectRoute;
