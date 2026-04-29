import Deal from "../models/Deal.js";

export const createDeal = async (req, res) => {
    try {
        const { title, customer, value, stage, expectedCloseDate, notes } = req.body;
        const deal = new Deal({
            title, customer, value, stage, expectedCloseDate, notes,
            createdBy: req.user._id,
        });
        const savedDeal = await deal.save();
        res.status(201).json({ success: true, data: savedDeal });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export const getDeals = async (req, res) => {
    try {
        const filter = req.user.role === "admin" ? {} : { createdBy: req.user._id };
        const deals = await Deal.find(filter)
            .sort({ createdAt: -1 })
            .populate("createdBy", "name email")
            .populate("customer", "name email");

        res.json({ success: true, count: deals.length, data: deals });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getDeal = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id)
            .populate("createdBy", "name email")
            .populate("customer", "name email");

        if (!deal) {
            return res.status(404).json({ success: false, message: "Deal not found" });
        }
        if (deal.createdBy._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(404).json({ success: false, message: "Not authorized to view this deal" });
        }
        res.json({ success: true, data: deal });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateDeal = async (req, res) => {
    try {
        const { title, customer, value, stage, expectedCloseDate, notes } = req.body;

        const deal = await Deal.findById(req.params.id);
        if (!deal) {
            return res.status(404).json({ success: false, message: "Deal not found" });
        }
        if (deal.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized to update this deal" });
        }

        const updated = await Deal.findByIdAndUpdate(
            req.params.id,
            { title, customer, value, stage, expectedCloseDate, notes },
            { new: true, runValidators: true }
        );
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteDeal = async (req, res) => {
    try {
        const deal = await Deal.findById(req.params.id);
        if (!deal) {
            return res.status(404).json({ success: false, message: "Deal not found" });
        }
        if (deal.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized to delete this deal" });
        }

        await Deal.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: "Deal deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}