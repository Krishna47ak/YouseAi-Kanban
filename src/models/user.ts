import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"]
  },
  email: {
    type: String,
    required: [true, "Please provide a email"],
    unique: true,
  },
  phone: {
    type: Number,
    required: [true, "Please provide a phone number"]
  },
  onBoarded: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: [true, "Please provide a password"]
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;