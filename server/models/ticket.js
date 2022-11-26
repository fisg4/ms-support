const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

ticketSchema.methods.cleanup = function() {
    return {
        title: this.title,
        text: this.text
    }
}

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;