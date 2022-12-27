const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    title: {
        type: String,
        maxLength: 100,
        required: true
    },
    text: {
        type: String,
        maxLength: 255,
        required: true
    },
    status: {
        type: String,
        enum: {
            values: ['sent', 'rejected', 'approved'],
            message: '{VALUE} is not supported'
        },
        default: 'sent',
        required: true
    },
    createDate: {
        type: Date,
        required: true
    },
    updateDate: {
        type: Date,
    },
});

reportSchema.methods.cleanup = function () {
    return {
        _id: this._id,
        authorId: this.authorId,
        reviewerId: this.reviewerId,
        messageId: this.messageId,
        title: this.title,
        text: this.text,
        status: this.status,
        createDate: this.createDate,
        updateDate: this.updateDate
    }
}

reportSchema.methods.updateReport = function updateReport(reviewerId, status) {
    this.reviewerId = reviewerId;
    this.status = status;
    this.updateDate = Date.now();
    return this.save();
};

reportSchema.methods.rollbackUpdateReport = function rollbackUpdateReport() {
    this.reviewerId = null;
    this.status = "sent";
    this.updateDate = null;
    return this.save();
};


const Report = mongoose.model('Report', reportSchema);

module.exports = Report;