const LogSchema = require("../model/log");

const createLog = async (req, res) => {
  try {
    const { jobId } = req.body;
    const { userId } = req.params; // ✅ get userId from URL param

    if (!jobId) return res.status(400).json({ success: false, message: "Job ID is required" });
    if (!userId) return res.status(400).json({ success: false, message: "User ID is required" });

    const newLog = new LogSchema({ user_id: userId, job_id: jobId });
    const savedLog = await newLog.save();

    res.json({ success: true, message: "Log created successfully", data: savedLog });
  } catch (error) {
    console.error("Error creating log:", error);
    res.status(500).json({ success: false, message: error.message || "Error creating log" });
  }
};


module.exports = { createLog };
