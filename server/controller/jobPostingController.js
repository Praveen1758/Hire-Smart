const JobPosting = require('../model/Job_model');
const { GoogleGenerativeAI } =require("@google/generative-ai");


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create job posting
exports.createJobPosting = async (req, res) => {
  try {
    console.log("Received job data:", req.body); // 👈 Add this line
    const job = new JobPosting(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error("Error creating job:", err); // 👈 Add this line
    res.status(400).json({ error: err.message });
  }
};


// Get all job postings
exports.getAllJobPostings = async (req, res) => {
  try {
    const { category } = req.query; // 🔑 from frontend

    let filter = {};

    if (category) {
      filter.jobCategory = category; // 🔴 MUST MATCH SCHEMA FIELD
    }

    const jobs = await JobPosting.find(filter)
      .populate('companyId', 'name logo')
      .populate('jobCategory', 'category_name');

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Get a job posting by ID
exports.getJobPostingById = async (req, res) => {
  try {
    const job = await JobPosting.findById(req.params.id)
      .populate('companyId', 'name logo email')
      .populate('jobCategory', 'category_name');
    if (!job) return res.status(404).json({ error: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getcompanyjobs = async (req, res) => {
  try {
    const { category, companyId } = req.query;

    let filter = {};

    if (category) {
      filter.jobCategory = category;
    }

    if (companyId) {
      filter.companyId = companyId; // ✅ FILTER BY COMPANY
    }

    const jobs = await JobPosting.find(filter)
      .populate('companyId', 'name logo')
      .populate('jobCategory', 'category_name');

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update a job posting
exports.updateJobPosting = async (req, res) => {
  try {
    const updatedJob = await JobPosting.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedJob);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a job posting
exports.deleteJobPosting = async (req, res) => {
  try {
    await JobPosting.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.Chat = async (req, res) => {
  const { message } = req.body;

  console.log("User message:", message);

  try {

    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite-preview"
    });

    // Helper → force 3 line response
    const limitLines = (text, max = 3) => {
      return text.split("\n").slice(0, max).join("\n");
    };

    // Helper → AI call
    const askAI = async (prompt) => {
      const result = await model.generateContent(prompt);
      return limitLines(result.response.text());
    };

    // ----------------------------------
    // 1️⃣ INTENT DETECTION
    // ----------------------------------

    const intentPrompt = `
User message: "${message}"

Detect intent and keyword.

Intents:
1. job_search
2. skill_based_recommendation
3. job_detail
4. general

Return JSON only:
{
 "intent":"job_search | skill_based_recommendation | job_detail | general",
 "keyword":"main keyword"
}
`;

    const intentResult = await model.generateContent(intentPrompt);

    let parsed;

    try {
      const cleanText = intentResult.response
        .text()
        .replace(/```json|```/g, "")
        .trim();

      parsed = JSON.parse(cleanText);

    } catch {
      parsed = { intent: "general", keyword: message };
    }

    let { intent, keyword } = parsed;

    if (!keyword || typeof keyword !== "string") {
      keyword = message;
    }

    console.log("Intent:", intent);
    console.log("Keyword:", keyword);

    const lowerMsg = message.toLowerCase();

    // Auto detect skill questions
    if (lowerMsg.includes("skill")) {
      intent = "job_detail";
    }

    // ----------------------------------
    // 2️⃣ JOB SEARCH
    // ----------------------------------

    if (intent === "job_search") {

      let skillsArray = keyword
        .toLowerCase()
        .split(/[,\s]+/)
        .filter(Boolean);

      // normalize
      skillsArray = skillsArray.map(skill => {
        if (skill === "js") return "javascript";
        if (skill === "reactjs") return "react";
        return skill;
      });

      console.log("Skills detected:", skillsArray);

      const skillQueries = skillsArray.map(skill => ({
        "skills.skill": { $regex: skill, $options: "i" }
      }));

      const jobs = await JobPosting.find({
        isActive: true,
        $or: [
          ...skillQueries,
          { jobTitle: { $regex: skillsArray.join("|"), $options: "i" } },
          { jobDescription: { $regex: skillsArray.join("|"), $options: "i" } },
          { location: { $regex: skillsArray.join("|"), $options: "i" } }
        ]
      })
        .populate("companyId", "name")
        .limit(5);

      if (jobs.length > 0) {

        const reply = jobs.map(job => `
💼 ${job.jobTitle}
🏢 ${job.companyId?.name || "Private Company"}
📍 ${job.location}
💰 ₹${job.salaryRange?.min || 0} - ₹${job.salaryRange?.max || "N/A"}
`).join("\n");

        return res.json({
          reply: `Here are jobs matching "${keyword}":\n${reply}`,
          jobs
        });
      }

      return res.json({
        reply:
          "No jobs found. Try searching 'React Developer', 'Accountant', or provide skills."
      });
    }

    // ----------------------------------
    // 3️⃣ SKILL RECOMMENDATION
    // ----------------------------------

    if (intent === "skill_based_recommendation") {

      let skillsArray = keyword
        .toLowerCase()
        .split(/[,\s]+/)
        .filter(Boolean);

      const skillQueries = skillsArray.map(skill => ({
        "skills.skill": { $regex: skill, $options: "i" }
      }));

      const jobs = await JobPosting.find({
        $or: [
          ...skillQueries,
          { jobTitle: { $regex: skillsArray.join("|"), $options: "i" } }
        ]
      })
        .populate("companyId", "name")
        .limit(3);

      if (jobs.length > 0) {

        const reply = jobs.map(job => `
💼 ${job.jobTitle}
🏢 ${job.companyId?.name || "Private Company"}
📍 ${job.location}
`).join("\n");

        return res.json({
          reply: `Jobs based on your skills (${skillsArray.join(", ")}):\n${reply}`,
          jobs
        });
      }

      return res.json({
        reply:
`Based on your skills (${skillsArray.join(", ")}), explore:
• Frontend Developer
• Web Developer
• Software Developer`
      });
    }

    // ----------------------------------
    // 4️⃣ JOB DETAILS
    // ----------------------------------

    if (intent === "job_detail") {

      const job = await JobPosting.findOne({
        $or: [
          { jobTitle: { $regex: keyword, $options: "i" } },
          { jobDescription: { $regex: keyword, $options: "i" } }
        ]
      }).populate("companyId", "name");

      if (job) {

        const skills =
          job.skills?.map(s => s.skill).join(", ") || "Not specified";

        const aiExplain = await askAI(`
You are a recruitment assistant from HIRESMART.

Explain this job role simply.

Job Title: ${job.jobTitle}
Description: ${job.jobDescription}

Rules:
- Maximum 3 lines
- Simple explanation
- Mention career growth
`);

        return res.json({
          reply: `
💼 ${job.jobTitle}

Required Skills: ${skills}

${aiExplain}

📍 ${job.location}
💰 ₹${job.salaryRange?.min || 0} - ₹${job.salaryRange?.max || "N/A"}
`,
          jobs: [job]
        });
      }

      return res.json({
        reply: "I couldn't find details for that role."
      });
    }

    // ----------------------------------
    // 5️⃣ GENERAL CHAT
    // ----------------------------------

    const fallback = await askAI(`
User said: "${message}"

You are a recruitment assistant from HIRESMART.

Rules:
- Reply in maximum 3 lines
- Friendly and helpful
- Focus on careers and hiring
`);

    return res.json({
      reply: fallback
    });

  } catch (error) {

    console.error("Chat Error:", error);

    return res.status(500).json({
      reply:
        "Our recruitment AI is taking a short break. Please try again shortly."
    });
  }
};