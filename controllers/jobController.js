import Job from "../models/jobModel.js";
import Company from "../models/companyModel.js";

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      location,
      salaryRange,
      status,
      company,
    } = req.body;

    const newJob = new Job({
      title,
      description,
      requirements,
      location,
      salaryRange,
      status,
      company,
    });

    await newJob.save();
    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ message: "Error creating job", error });
  }
};

export const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updateData = req.body;

    const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res
      .status(200)
      .json({ message: "Job updated successfully", job: updatedJob });
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const deletedJob = await Job.findByIdAndDelete(jobId);

    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error });
  }
};

export const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      companyName,
      minSalary,
      maxSalary,
      date,
      location,
    } = req.query;
    const skip = (page - 1) * limit;

    // Build the query object
    let query = {};

    // Filter by company name (joins with the Company collection)
    if (companyName) {
      const company = await Company.findOne({ name: companyName });
      if (company) {
        query.company = company._id;
      } else {
        return res.status(404).json({ message: "Company not found" });
      }
    }

    // Filter by salary range
    if (minSalary || maxSalary) {
      query.salaryRange = {};
      if (minSalary) query.salaryRange.min = { $gte: minSalary };
      if (maxSalary) query.salaryRange.max = { $lte: maxSalary };
    }

    // Filter by creation date
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(new Date(date).setDate(startDate.getDate() + 1)); // Next day
      query.createdAt = { $gte: startDate, $lt: endDate };
    }

    // Filter by location
    if (location) {
      query.location = new RegExp(location, "i"); // Case-insensitive regex search
    }

    // Find jobs with pagination and populate company name
    const jobs = await Job.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("company", "name") // Populate only the name of the company
      .exec();

    const totalJobs = await Job.countDocuments(query);
    const totalPages = Math.ceil(totalJobs / limit);

    res.status(200).json({
      jobs,
      pagination: { page: parseInt(page), totalPages, totalJobs },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
  }
};
