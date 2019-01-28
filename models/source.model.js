const mongoose = require('mongoose');
const { Schema } = mongoose;
const ObjectId = mongoose.Types.ObjectId;

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

sourceSchema.statics.findSourcesByUserId = function (user_id, cb) {
    this.find({ author: new ObjectId(user_id)})
        .select('title file_name file_data.secure_url description')
        .exec(cb);
};

module.exports = mongoose.model("Source", sourceSchema);