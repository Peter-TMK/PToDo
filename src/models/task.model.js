const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      // unique: true,
    },
    description: {
      type: String,
      // required: true,
      // unique: true,
    },
    status: [
      {
        type: String,
        enum: ["not-started", "pending", "in-progress", "completed"],
        default: "pending",
      },
    ],
    dueDate: { type: Date },
    user: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

TaskSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Task", TaskSchema);
