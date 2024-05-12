const { Router } = require("express");
const {
  getVehicule,
  getVehicules,
  createVehicule,
  editVehicule,
  deleteVehicule
} = require("../Controllers/VehiculeController");
const authMiddleware = require("../Middlewares/AuthMiddlewares");

const router = Router();

router.get("/getVehicule/:id", authMiddleware, getVehicule);
router.get("/getVehicules/:id", authMiddleware, getVehicules);
router.post("/createVehicule", authMiddleware, createVehicule);
router.patch("/editVehicule/:id", authMiddleware, editVehicule);
router.delete("/deleteVehicule/:id", authMiddleware, deleteVehicule);

module.exports = router;
