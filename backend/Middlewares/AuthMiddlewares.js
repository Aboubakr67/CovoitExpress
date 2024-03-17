const jwt = require("jsonwebtoken");
const HttpError = require("../Models/errorModel");

const authMiddleware = async (req, res, next) => {
  const Authorization = req.headers.Authorization || req.headers.authorization;

  if (Authorization && Authorization.startsWith("Bearer")) {
    const token = Authorization.split(" ")[1]; // Bearer z564d8z6es18z6s4d68s4dcs8c donc on récupere uniquement le token
    jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
      if (err) {
        return next(new HttpError("Unauthorized. Invalid token.", 403));
      }

      req.user = info;
      next();
    });
  } else {
    return next(new HttpError("Unauthorized. No token", 402));
  }
};

module.exports = authMiddleware;
