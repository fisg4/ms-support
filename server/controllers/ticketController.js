const Ticket = require("../models/ticket");
const songService = require("../services/songs");
const debug = require('debug');
const { compile } = require("morgan");


/* GET all tickets */
const getAllTickets = async (request, response) => {
    try {
        const tickets = await Ticket.getAll();
        if (!tickets) {
            response.status(404).json({
                success: false,
                message: `No tickets found`,
                content: {}
            });
            return;
        }
        response.status(200).send({
            success: true,
            message: "All tickets found",
            content: tickets
        });
    } catch (error) {
        debug("Database problem", error);
        response.status(500).send({
            success: false,
            message: "Internal server error. Something went wrong!",
            content: null
        });
    }
};

/* GET all tickets by user id */
const getUserTickets = async (request, response) => {
    const id = request.params.id;
    try {
        const tickets = await Ticket.find({ authorId: id });
        if (!tickets) {
            response.status(404).send({
                success: false,
                message: `No tickets found for user with id '${id}' `,
                content: null
            });
            return;
        }
        response.status(200).send({
            success: true,
            message: "All tickets found",
            content: tickets
        });
    } catch (error) {
        debug("Database problem", error);
        response.status(500).send({
            success: false,
            message: "Internal server error. Something went wrong!",
            content: null
        });
    }
};

/* GET ticket by id */
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
        response.status(200).send({
            success: true,
            message: "Ticket found",
            content: ticket
        });
    } catch (error) {
        debug("Database problem", error);
        response.status(500).send({
            success: false,
            message: "Internal server error. Something went wrong!",
            content: null
        });
    }
};

/* POST ticket by normal user */
const createTicket = async (request, response) => {
    const { authorId, songId, title, text, priority } = request.body;

    try {
        const ticket = await Ticket.insert(authorId, songId, title, text, priority);
        response.status(201).send({
            success: true,
            message: "Ticket created",
            content: ticket
        });
    } catch (error) {
        if (error.errors) {
            debug("Validation problem when saving");
            response.status(400).send({
                success: false,
                message: error.errors.message,
                content: null
            });
        } else {
            debug("System problem", error);
            response.status(500).send({
                success: false,
                message: "Internal server error. Something went wrong!",
                content: null
            });
        }
    }
};


const updateSongUrl = async (ticket) => {
    try {
        var response = await songService.changeUrl(ticket.songId.toString(), ticket.text);
        return response;
    } catch (error) {
        debug('Services problem');
        response.send({ error: error.message });
    }
}

/* PATCH ticket by admin */
const updateTicket = async (request, response) => {
    const { id } = request.params;
    const { reviewerId, status, priority } = request.body;

    try {
        var ticket = await Ticket.getById(id);
        if (!ticket) {
            response.status(404).json({
                success: false,
                message: `Ticket with id '${id}' not found`,
                content: {}
            });
            return;
        };

        const oldStatus = ticket.status;
        const oldPriority = ticket.priority;

        await ticket.updateTicket(reviewerId, status, priority);

        if (ticket.status === 'validated' && ticket.songId) {
            var songsResponse = await updateSongUrl(ticketUpdated);
            if (songsResponse.status !== 200) {
                await ticket.rollbackUpdate(oldStatus, oldPriority)
                response.status(songsResponse.status).json({
                    success: false,
                    message: songsResponse.message,
                    content: {}
                });
                return;
            }
        }

        response.status(204).json({
            success: true,
            message: `Ticket updated`,
            content: {}
        });
    } catch (error) {
        if (error.errors) {
            debug("Validation problem when updating");
            response.status(400).send({
                success: false,
                message: error.errors.message,
                content: null
            });
        } else {
            debug("System problem", error);
            response.status(500).send({
                success: false,
                message: "Internal server error. Something went wrong!",
                content: null
            });
        }
    }
};


/* DELETE ticket by admin */
const deleteTicket = async (request, response) => {
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
        await ticket.removeTicket();
        response.status(204).json({
            success: true,
            message: `Ticket deleted`,
            content: {}
        });

    } catch (error) {
        debug("System problem", error);
        response.status(500).send({
            success: false,
            message: "Internal server error. Something went wrong!",
            content: null
        });
    }
};

module.exports = {
    getAllTickets, getUserTickets, getTicket, createTicket, updateTicket, deleteTicket
};