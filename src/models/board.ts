import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a board name"]
    },
    tasks: [{
        title: { type: String },
        status: { type: String },
        description: { type: String },
        priority: { type: String },
        dueDate: { type: Date }
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

const Board = mongoose.models.boards || mongoose.model("boards", boardSchema);

export default Board;