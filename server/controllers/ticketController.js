const Ticket = require("../models/ticket");
const songService = require("../services/songs");
const debug = require('debug');


const getAllTickets = async (request, response, next) => {
    try {
        const result = await Ticket.find();
        response.send(result.map((ticket) => ticket.cleanup()));
    } catch (error) {
        debug("Database problem", error);
        response.sendStatus(404).send({error: error.message});
    }
};

const getTicketById = async (request, response, next) => {
    try {
        var ticketId = request.params.id;
        const result = await Ticket.findById(ticketId);
        response.send(result.cleanup());
    } catch (error) {
        debug("Database problem", error);
        response.sendStatus(404).send({error: error.message});
    }
};

const createTicket = async (request, response, next) => {
    const {authorId, songId, title, text, priority} = request.body;

    const createDate = Date.now();

    const ticket = new Ticket({authorId, songId, title, text, priority, createDate});

    try {
        await ticket.save();
        response.status(201).send(ticket.cleanup());
    } catch (error) {
        if (error.errors) {
            debug("Validation problem when saving");
            response.status(400).send({error: error.message});
        } else {
            debug("Database problem", error);
            response.sendStatus(500);
        }
    }
};

const updateSongUrl = async (ticket) => {
    try {
        var response = await songService.changeUrl(ticket.songId.toString(), ticket.text);
        return response;
    } catch (error) {
        debug('Services problem');
        response.send({error: error.message});
    }
}

const updateTicket = async (request, response, next) => {
    const ticketId = request.params.id;

    try {
        var ticket = await Ticket.findById(ticketId);

        ticket.reviewerId = request.body.reviewerId;
        ticket.status = request.body.status;
        ticket.priority = request.body.priority;
        ticket.updateDate = Date.now();

        ticketUpdated = await ticket.save();

        if (ticketUpdated.status === 'validated' && ticketUpdated.text.startsWith('http')) {
            var res = await updateSongUrl(ticketUpdated);
        }

        response.send(res);
    } catch (error) {
        if (error.errors) {
            debug("Validation problem when updating");
            response.status(400).send({error: error.message});
        } else {
            debug("Database problem", error);
            response.sendStatus(500);
        }
    }
};

const deleteTicket = async (request, response, next) => {
    try {
        const ticketId = request.params.id;
        await Ticket.findByIdAndDelete(ticketId);
        response.sendStatus(204);
    } catch (error) {
        debug("Database problem", error);
        response.status(404).send(error.message);
    }
};

module.exports = {
    getAllTickets, getTicketById, createTicket, updateTicket, deleteTicket
};