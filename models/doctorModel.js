const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
  name: String,
  imageUrl: String,
  specialization: String,
  experience: Number,
  location: String,
  date: {
    type: Date,
    default: Date.now, 
  },
  slots: Number,
  fee: Number,
},{
    versionKey:false
});

const DoctorModel = mongoose.model('Doctor', doctorSchema);

module.exports = DoctorModel;
