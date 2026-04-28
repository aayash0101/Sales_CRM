import Lead from '../models/Lead.js';
import Customer from '../models/Customer.js';

export const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body;
    const lead = new Lead({
      name, email, phone, company, status,
      createdBy: req.user._id,
    });
    const savedLead = await lead.save();
    res.status(201).json({ success: true, data: savedLead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeads = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { createdBy: req.user._id };
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");
    res.json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body;

    // 1. Find lead first
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }

    // 2. Check ownership
    if (lead.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to update this lead" });
    }

    // 3. Update the lead
    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, company, status },
      { new: true, runValidators: true }
    );

    // 4. Auto-create customer if status changed to converted
    let customer = null;
    if (status === "converted") {
      const existingCustomer = await Customer.findOne({ lead: lead._id });

      if (!existingCustomer) {
        customer = await Customer.create({
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          company: updated.company,
          lead: updated._id,
          createdBy: req.user._id,
        });
      } else {
        customer = existingCustomer;
      }
    }

    res.json({
      success: true,
      data: updated,
      customer: customer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    if (lead.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this lead" });
    }
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Lead deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};