const { Router } = require("express");
const {
  getTrajets,
  getInfoApiOpenRouteService,
  createTrajet,
} = require("../Controllers/TrajetControllers");
const authMiddleware = require("../Middlewares/AuthMiddlewares");

const router = Router();

router.get("/getTrajets/:id", authMiddleware, getTrajets);

router.post(
  "/getInfoApiOpenRouteService",
  authMiddleware,
  getInfoApiOpenRouteService
);

router.post("/createTrajet", authMiddleware, createTrajet);

module.exports = router;
