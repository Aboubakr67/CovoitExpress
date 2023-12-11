const { register, login } = require('../Controllers/AuthControllers');
const { checkUser } = require('../Middlewares/AuthMiddlewares');

const router = require('express').Router();

// router.post("/");
router.post("/api/dashboard", checkUser);
router.post("/api/auth/register", register);
router.post("/api/auth/login", login);


module.exports = router;