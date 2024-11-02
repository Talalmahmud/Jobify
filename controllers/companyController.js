export const createCompany = async (req, res) => {
  try {
    const { name, description, logo } = req.body;
    const createdBy = req.user.id;

    const newCompany = new Company({ name, description, logo, createdBy });
    await newCompany.save();

    res
      .status(201)
      .json({ message: "Company created successfully", company: newCompany });
  } catch (error) {
    res.status(500).json({ message: "Error creating company", error });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const companies = await Company.find()
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email") // Populate the creator's name and email
      .exec();

    const totalCompanies = await Company.countDocuments();
    const totalPages = Math.ceil(totalCompanies / limit);

    res.status(200).json({
      companies,
      pagination: { page, totalPages, totalCompanies },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching companies", error });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const updateData = req.body;

    const updatedCompany = await Company.findByIdAndUpdate(
      companyId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({
      message: "Company updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating company", error });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const deletedCompany = await Company.findByIdAndDelete(companyId);

    if (!deletedCompany) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting company", error });
  }
};
