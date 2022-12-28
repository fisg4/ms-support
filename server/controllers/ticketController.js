const Ticket = require("../models/ticket");
const songService = require("../services/songs");
const debug = require('debug');
const { compile } = require("morgan");


const getAllTickets = async (request, response) => {
    try {
        const tickets = await Ticket.getAll();
        response.send(tickets.map((ticket) => ticket));
    } catch (error) {
        debug("Database problem", error);
        response.sendStatus(404).send({error: error.message});
    }
};

const getUserTickets = async (request, response) => {
    // const userId = auth user id;
    try {
        const tickets = await Ticket.getAll();
        response.send(tickets.map((ticket) => ticket));
    } catch (error) {
        debug("Database problem", error);
        response.sendStatus(404).send({error: error.message});
    }
};

const getTicket = async (request, response) => {
    const { id } = request.params;

    try {
        const ticket = await Ticket.getById(id);
        if (!ticket) {
            response.status(404).json({
                success: false,
                message: `Ticket with id '${id}' not found`,
                content: {}
              });
              return;
        };
        response.send(ticket);
    } catch (error) {
        debug("Database problem", error);
        response.sendStatus(404).send({error: error.message});
    }
};

const createTicket = async (request, response) => {
    const { authorId, songId, title, text, priority } = request.body;

    try {
        const ticket = await Ticket.insert(authorId, songId, title, text, priority);
        response.status(201).send(ticket);
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

const updateTicket = async (request, response) => {
    const { id } = request.params;
    const { reviewerId, status, priority } = request.body;

    try {
        var ticket = await Ticket.getById(id);

        const ticketUpdated = await ticket.updateTicket(reviewerId, status, priority);

        // if (ticketUpdated.status === 'validated' && ticketUpdated.songId) {
        //     // var songsResponse = await updateSongUrl(ticketUpdated);
        //     if (true) {
        //         ticket.status = oldStatus;

        //         await ticket.save();
        //     }
        // }

        response.sendStatus(204);
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

const deleteTicket = async (request, response) => {
    const { id } = request.params;

    try {
        const ticket = await Ticket.getById(id);
        if (!ticket) {
            response.status(404)
            return;
        };
        await ticket.removeTicket();
        response.sendStatus(204);
    } catch (error) {
        debug("Database problem", error);
        response.status(404).send(error.message);
    }
};

module.exports = {
    getAllTickets, getUserTickets, getTicket, createTicket, updateTicket, deleteTicket
};