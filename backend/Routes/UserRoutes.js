const { Router } = require("express");
const {
  getUser,
  editUser,
  editPassword,
} = require("../Controllers/UserControllers");
const authMiddleware = require("../Middlewares/AuthMiddlewares");

const router = Router();

router.get("/getUser/:id", authMiddleware, getUser);
router.put("/editUser/:id", authMiddleware, editUser);
router.put("/editPassword/:id", authMiddleware, editPassword);

module.exports = router;
