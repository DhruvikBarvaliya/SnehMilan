const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.pluralize(null);

const EmployeeSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "STUDENT"],
      default: "STUDENT",
    },
    first_name: { type: String, trim: true },
    middle_name: { type: String, trim: true },
    last_name: { type: String, trim: true },
    full_name: { type: String, trim: true },
    std: {
      type: String,
      enum: [
        "UKG",
        "LKG",
        "JKG",
        "SKG",
        "1st",
        "2nd",
        "3rd",
        "4th",
        "5th",
        "6th",
        "7th",
        "8th",
        "9th",
        "10th",
        "11th-Com",
        "11th-Sci",
        "11th-Art",
        "12th-Art",
        "12th-Com",
        "12th-Sci",
      ],
    },
    marks: { type: Number, trim: true },
    total_marks: { type: Number, trim: true },
    percentage: { type: Number, default: 0 },
    phone: { type: String, trim: true },
    email: {
      type: String,
    },
    password: { type: String, trim: true },
    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
    },
    date_of_birth: { type: Date },
    is_verified: { type: Boolean },
    status: { type: String, trim: true },
    is_active: { type: Boolean },
    last_login: { type: Date },
  },
  { versionKey: false, timestamps: true }
);

module.exports = mongoose.model("employee", EmployeeSchema);
