const { Router } = require("express");
const {
  register,
  login,
  checkUserExists,
} = require("../Controllers/AuthControllers");
const authMiddleware = require("../Middlewares/AuthMiddlewares");

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/checkUserExists", checkUserExists); // Vérifier si l'addresse email est déja utiliser par un autre user
// router.post("/api/dashboard", authMiddleware);

module.exports = router;
