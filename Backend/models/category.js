const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      unique: true,
    },
  },
  { timestamps: true }
); //whenever I am making a new entry to the schema, it records the exact time

module.exports = mongoose.model("category", categorySchema);
