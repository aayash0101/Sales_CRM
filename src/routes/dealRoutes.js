import express from "express";
import { createDeal, getDeals, getDeal, updateDeal, deleteDeal } from "../controllers/dealController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createDeal);
router.get("/", protect, getDeals);
router.get("/:id", protect, getDeal);
router.put("/:id", protect, updateDeal);
router.delete("/:id", protect, deleteDeal);

export default router;