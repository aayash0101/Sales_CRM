import Lead from '../models/Lead.js';

export const createLead = async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body;

    const lead = new Lead({ name, email, phone, company, status });
    const savedLead = await lead.save();

    res.status(201).json({ success: true, data: savedLead });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating lead', error: error.message });
  }
};

export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({ success: true, count: leads.length, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body;

    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, company, status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const deleted = await Lead.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};