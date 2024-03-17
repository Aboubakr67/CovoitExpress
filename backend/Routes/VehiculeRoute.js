const { Router } = require("express");
const {
  getVehicules,
  createAndAddVehiculeToUser,
} = require("../Controllers/VehiculeController");
const authMiddleware = require("../Middlewares/AuthMiddlewares");

const router = Router();

router.get("/getVehicules/:id", authMiddleware, getVehicules);
router.post(
  "/createAndAddVehiculeToUser",
  authMiddleware,
  createAndAddVehiculeToUser
);

module.exports = router;
