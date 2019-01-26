const mongoose = require('mongoose');
const { Schema } = mongoose;

const sourceSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    file_name: {
        type: String,
        required: true
    },
    file_data: {
        type: Schema.Types.Mixed,
        required: true
    },
    description: {
        type: String,
        required: true
    },    
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    // uploadAt, createAt
    timestamps: true
});

module.exports = mongoose.model("Source", sourceSchema);