const Ticket = require("../models/ticket");
const songService = require("../services/songs");
const debug = require('debug');
const {decodeToken} = require("../auth/jwt");


/* GET all tickets */
const getAllTickets = async (request, response) => {
    try {
        const tickets = await Ticket.getAll();

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
    const token = request.headers.authorization;
    const decodedToken = decodeToken(token);
    const id = request.params.id;

    if (decodedToken.id !== id) {
        response.status(401).send({
            success: false,
            message: "Unauthorized. You can only read your own tickets",
            content: null
        });
        return;
    }

    try {
        const tickets = await Ticket.find({ authorId: id });

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
    const token = request.headers.authorization;
    const decodedToken = decodeToken(token);
    const { id } = request.params;

    try {
        const ticket = await Ticket.getById(id);
        if (!ticket) {
            response.status(404).send({
                success: false,
                message: `Ticket with id '${id}' not found`,
                content: {}
            });
            return;
        };
        if (decodedToken.id !== ticket.authorId && decodedToken.role !== "admin") {
            response.status(401).send({
                success: false,
                message: "Unauthorized. You can only read your own tickets",
                content: null
            });
            return;
        }

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
    const token = request.headers.authorization;
    const decodedToken = decodeToken(token);
    const { authorId, songId, title, text, priority } = request.body;

    if (decodedToken.id !== authorId) {
        response.status(401).send({
            success: false,
            message: "Unauthorized. You can only create tickets for yourself",
            content: null
        });
        return;
    }

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

/* PATCH ticket by admin */
const updateTicket = async (request, response) => {
    const token = request.headers.authorization;
    const decodedToken = decodeToken(token);
    const { id } = request.params;
    const { reviewerId, status, priority } = request.body;

    if (decodedToken.id !== reviewerId) {
        response.status(401).send({
            success: false,
            message: "Unauthorized. You can only update tickets for yourself",
            content: null
        });
        return;
    }

    var ticket = await Ticket.getById(id);
        if (!ticket) {
            response.status(404).send({
                success: false,
                message: `Ticket with id '${id}' not found`,
                content: {}
            });
            return;
        } else if (ticket.reviewerId) {
            response.status(409).send({
                success: false,
                message: "Bad request. The ticket has already been reviewed",
                content: null
            });
            return;
        };

        const oldStatus = ticket.status;
        const oldPriority = ticket.priority;

    try {
        await ticket.updateTicket(reviewerId, status, priority);

        if (ticket.status === 'validated' && ticket.songId) {
            const songsResponse = await songService.changeUrl(ticket.songId.toString(), ticket.text, token);

            if (songsResponse.status !== 200) {
                await ticket.rollbackUpdate(oldStatus, oldPriority)
                response.status(songsResponse.status).send({
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
            if(ticket.reviewerId) {
                await ticket.rollbackUpdate(oldStatus, oldPriority)
            }
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
        await Ticket.findByIdAndDelete(id);
        response.status(204).send({
            success: true,
            message: `Ticket deleted`,
            content: {}
        });

    } catch (error) {
        debug("System problem", error);
        response.status(404).send({
            success: false,
            message: `Ticket with id '${id}' not found`,
            content: {}
        });
    }
};

module.exports = {
    getAllTickets, getUserTickets, getTicket, createTicket, updateTicket, deleteTicket
};