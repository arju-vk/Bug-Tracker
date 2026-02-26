const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    ticketKey: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    type: {
      type: String,
      enum: ["Bug", "Feature", "Task", "Improvement"],
      default: "Bug",
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    attachments: [
      {
        filename: String,
        url: String,
      },
    ],
    labels: [String],
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Generate ticket key before saving
ticketSchema.pre("save", async function (next) {
  if (!this.ticketKey) {
    const count = await mongoose
      .model("Ticket")
      .countDocuments({ project: this.project });
    this.ticketKey = `TICKET-${count + 1}`;
  }
  next();
});

module.exports = mongoose.model("Ticket", ticketSchema);
