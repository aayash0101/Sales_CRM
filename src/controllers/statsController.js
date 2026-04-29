import Lead from "../models/Lead.js";
import Customer from "../models/Customer.js";
import Deal from "../models/Deal.js";

export const getStats = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const userFilter = isAdmin ? {} : { createdBy: req.user._id };

    // Run all queries simultaneously
    const [
      totalLeads,
      totalCustomers,
      totalDeals,
      dealsByStage,
      wonDeals,
      recentLeads,
    ] = await Promise.all([
      Lead.countDocuments(userFilter),
      Customer.countDocuments(userFilter),
      Deal.countDocuments(userFilter),
      Deal.aggregate([
        { $match: userFilter },
        { $group: { _id: "$stage", count: { $sum: 1 }, value: { $sum: "$value" } } },
      ]),
      Deal.aggregate([
        { $match: { ...userFilter, stage: "won" } },
        { $group: { _id: null, total: { $sum: "$value" } } },
      ]),
      Lead.find(userFilter)
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name company status createdAt"),
    ]);

    res.json({
      success: true,
      data: {
        totalLeads,
        totalCustomers,
        totalDeals,
        wonRevenue: wonDeals[0]?.total || 0,
        dealsByStage,
        recentLeads,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};