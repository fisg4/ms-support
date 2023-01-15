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

// static methods

ticketSchema.statics.getById = (id) => mongoose.model('Ticket').findById(id);

ticketSchema.statics.getAll = () => mongoose.model('Ticket').find();

ticketSchema.statics.getUserTickets = (id) => mongoose.model('Ticket').find({authorId: id});

ticketSchema.statics.insert = (authorId, songId, title, text, priority) => {
    let newTicket = {authorId, songId, title, text, priority, createDate: Date.now()};

    return mongoose.model('Ticket').create(newTicket);
};

// instance methods

ticketSchema.methods.updateTicket = function updateTicket(reviewerId, status, priority) {
    this.reviewerId = reviewerId;
    this.status = status;
    this.priority = priority;
    this.updateDate = Date.now();
    return this.save();
};

ticketSchema.methods.rollbackUpdate = function rollbackUpdate(oldStatus, oldPriority) {
    this.reviewerId = null;
    this.status = oldStatus;
    this.priority = oldPriority;
    this.updateDate = null;
    return this.save();
}

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;