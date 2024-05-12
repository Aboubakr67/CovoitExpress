const { Router } = require("express");
const {
  getTrajet,
  getTrajets,
  createTrajet,
  editTrajet,
  deleteTrajet,
  addPassager,
  getInfoApiOpenRouteService,
  searchTrajet,
} = require("../Controllers/TrajetControllers");
const authMiddleware = require("../Middlewares/AuthMiddlewares");

const router = Router();

router.get("/getTrajet/:id", authMiddleware, getTrajet);
router.get("/getTrajets/:id", authMiddleware, getTrajets);
router.post("/createTrajet", authMiddleware, createTrajet);
router.patch("/editTrajet/:id", authMiddleware, editTrajet);
router.delete("/deleteTrajet/:id", authMiddleware, deleteTrajet);
router.post("/addPassager/:id", authMiddleware, addPassager);

router.post(
  "/getInfoApiOpenRouteService",
  authMiddleware,
  getInfoApiOpenRouteService
);

router.post("/searchTrajet", authMiddleware, searchTrajet);

module.exports = router;
