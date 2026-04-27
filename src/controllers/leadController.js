import Lead from '../models/Lead.js';

export const createLead = async (req, res) => {
    try {
        const lead = newLead (req.body);
        const savedLead = await lead.save();
        res.status(201).json(savedLead);
    } catch (error) {
        res.status(500).json( { message: 'Error creating lead', error })
    } 
}