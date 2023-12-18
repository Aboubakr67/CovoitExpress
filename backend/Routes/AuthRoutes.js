const { register, login, checkUserExists } = require('../Controllers/AuthControllers');
const { checkUser } = require('../Middlewares/AuthMiddlewares');

const router = require('express').Router();


router.post("/api/auth/register", register);
router.post("/api/auth/login", login);

router.post("/api/auth/checkUserExists", checkUserExists);
router.post("/api/dashboard", checkUser);


module.exports = router;