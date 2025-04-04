import mongoose from "mongoose";

const loadSchema= mongoose.Schema ({
  brokerName: {
    type: String,
    required: true,
  },
  loadNumber: {
    type: String,
    required: true,
  },
  confirmationNumber: {
    type: String,
    required: true,
  },
  pickupDate: {
    type: Date,
    required: true, 
  },
  pickupLocation: {
    type: String,
    required: true, 
  },
  deliveryDate: {
    type: Date,
    required: true, 
  },
  deliveryLocation: {
    type: String,
    required: true,  
  },
  rate: {
    type: Number,
    required: true, 
  },
  notes: String,
  paymentStatus: {
    type: String,
    enum: ["paid", "not paid"],
    required: true,
  },
    contactedDate: {
      type: Date,
      required: false, 
    },
});

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  loads: [loadSchema],
});

const User = mongoose.model("User", userSchema);

export default User;
