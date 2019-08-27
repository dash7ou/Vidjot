const mongoose = require("mongoose");

const SchemaIdea = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    details: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    //realy bro
    timestamps: true
  }
);

const Idea = mongoose.model("Idea", SchemaIdea);

module.exports.Idea = Idea;
