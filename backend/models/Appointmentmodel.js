import mongoose from "mongoose";

// Define a schema for the appointment data
const appointmentSchema = new mongoose.Schema({
  doctorId: { type:String, required: true },
  doctorName: { type:String, required: true },
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  clinicName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
},
//collection name  
{
    collection: 'appointments' // Specify the desired collection name here
}
);

export default mongoose.model("Appointment", appointmentSchema)