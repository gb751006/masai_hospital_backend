const express = require("express");
const DoctorModel = require("../models/doctorModel"); 
const {auth}=require("../middleware/auth.middleware")
const doctorRouter = express.Router();

doctorRouter.use(auth);

// Create a new doctor
doctorRouter.post("/add", async (req, res) => {
  try {
    const { name, imageUrl, specialization, experience, location, slots, fee } = req.body;
    const newDoctor = new DoctorModel({
      name,
      imageUrl,
      specialization,
      experience,
      location,
      slots,
      fee,
    });
    await newDoctor.save();
    res.status(200).json({ message: "Doctor added successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error occurred while adding a doctor" });
  }
});

// Get a list of doctors
doctorRouter.get("/", async (req, res) => {
  try {
    const { page = 1, specialization, q, order } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;
    let filter = {};

    if (specialization) {
      filter.specialization = specialization;
    }
    if (q) {
      filter.$or = [{ name: { $regex: q, $options: "i" } }];
    }
    const sortOptions = {};
    if (order === "asc") {
      sortOptions.date = 1;
    } else if (order === "desc") {
      sortOptions.date = -1;
    }

    const doctors = await DoctorModel.find({ ...filter })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.send(doctors);
  } catch (err) {
    res.json({ error: err.message });
  }
});

// Update doctor information
doctorRouter.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { name, imageUrl, specialization, experience, location, slots, fee } = req.body;
    const doctor = await DoctorModel.findById(id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    if (name) {
      doctor.name = name;
    }
    if (imageUrl) {
      doctor.imageUrl = imageUrl;
    }
    if (specialization) {
      doctor.specialization = specialization;
    }
    if (experience) {
      doctor.experience = experience;
    }
    if (location) {
      doctor.location = location;
    }
    if (slots) {
      doctor.slots = slots;
    }
    if (fee) {
      doctor.fee = fee;
    }
    await doctor.save();
    res.status(200).json({ message: "Doctor updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error occurred while updating a doctor" });
  }
});

// Delete a doctor
doctorRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedDoctor = await DoctorModel.findByIdAndDelete(id);
    if (!deletedDoctor) {
      res.status(404).json({ message: "Doctor not found" });
    }
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error occurred while deleting a doctor" });
  }
});

module.exports = doctorRouter;
