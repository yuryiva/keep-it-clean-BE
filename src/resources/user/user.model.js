const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      require: true,
    },
    area: {
      type: String,
    },
    phone: {
      type: String,
      require: true,
    },
    is_checked: {
      type: Boolean,
      default: true,
    },
    user_events: Array,
    subscribed_events: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);
