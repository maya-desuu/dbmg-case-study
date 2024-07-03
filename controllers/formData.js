const TmpFormData = require("../models/tmpFormData");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const storeFormData = async (req, res) => {
  try {
    const formData = req.body;

    // Store form data in the database
    const savedFormData = await TmpFormData.create({ data: formData });

    // Generate a JWT token
    const token = jwt.sign(
      { formDataId: savedFormData._id },
      process.env.FORM_DATA_TOKEN,
      { expiresIn: "1h" },
    );

    res.status(StatusCodes.OK).json({ token });
  } catch (error) {
    console.error("Error in storeFormData:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const getFormData = async (req, res) => {
  try {
    const formDataId = req.formDataId;

    // Retrieve form data from the database
    const formData = await TmpFormData.findById(formDataId);

    if (!formData) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Form data not found" });
    }

    // Delete the form data from the database
    await TmpFormData.findByIdAndDelete(formDataId);

    console.log(formData.data);
    res.status(StatusCodes.OK).json(formData.data);
  } catch (error) {
    console.error("Error in getFormData:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

module.exports = { getFormData, storeFormData };
