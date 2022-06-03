const mongoose = require("mongoose");
const { Schema } = mongoose;

const URLSchema = new Schema({
  origin: { type: String, unique: true, required: true },
  shortURL: {
    type: String,
    unique: true,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "usuario",
    required: true,
  },
});

const Url = mongoose.model("Url", URLSchema);
module.exports = Url;
