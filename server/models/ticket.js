const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    reviewerId: {
        type: mongoose.Schema.Types.ObjectId
    },
    songId: {
        type: mongoose.Schema.Types.ObjectId
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
            values: ['sent', 'rejected', 'validated'],
            message: '{VALUE} is not supported'
        },
        default: 'sent',
        required: true,
    },
    priority: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high'],
            message: '{VALUE} is not supported'
        },
        default: 'low',
        required: true,
    },
    createDate: {
        type: Date,
        required: true
    },
    updateDate: {
        type: Date,
    }
});

ticketSchema.methods.cleanup = function() {
    return {
        authorId: this.authorId,
        reviewerId: this.reviewerId,
        songId: this.songId,
        title: this.title,
        text: this.text,
        status: this.status,
        priority: this.priority,
        createDate: this.date,
        updateDate: this.updateDate
    }
}

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;