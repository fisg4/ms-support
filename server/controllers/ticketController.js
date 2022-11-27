const Ticket = require("../models/ticket");
const debug = require('debug');

const ticketDb = [
    {
      userId: '1',
      text: 'Este es un mensaje de prueba',
      id: '1',
      date: '2022/11/17 18:26:00',
      status: 'ongoing',
      priority: 'medium'
    },
    {
      userId: '2',
      text: 'Este es otro mensaje de prueba',
      id: '2',
      date: '2022/11/19 18:30:25',
      status: 'rejected',
      priority: 'low'
    }
];

const getAllTickets = async (req, res, next) => {
    try {
        const result = await Ticket.find();
        res.send(result.map((ticket) => ticket.cleanup()));
    } catch (error) {
        debug("DB problem", error);
        res.sendStatus(500);
    }
};

const getTicketById = (req, res, next) => {
    var ticketId = req.params.id;

    var ticket = ticketDb.find(t => {
        return t.id === ticketId;
    });

    if (ticket) {
        res.send(ticket);
    } else {
        res.sendStatus(404);
    }
};

const createTicket = async (req, res, next) => {
    var {title, text} = req.body;

    const ticket = new Ticket({
        title,
        text
    });

    try {
        await ticket.save();
        return res.sendStatus(201);
    } catch (error) {
        if (error.errors) {
            debug("Validation problem when saving");
            res.status(400).send({error: error.message});
        } else {
            debug("DB problem", error);
            res.sendStatus(500);
        }
    }
};

const updateTicket = (req, res, next) => {
    var ticketId = req.params.id;

    const ticket = ticketDb.find(t => {
        return t.id === ticketId;
    });

    if (ticket) {
        var ticketUpdated = req.body;
        const index = ticketDb.indexOf(ticket);
        ticketDb[index].text = ticketUpdated.text;
        res.send(ticketDb[index]);
    } else {
        res.sendStatus(404);
    }
};

const deleteTicket = (req, res, next) => {
    const ticketId = req.params.id;

    const ticket = ticketDb.find(t => {
        return t.id === ticketId;
    });

    if (ticket) {
        const index = ticketDb.indexOf(ticket);
        ticketDb.splice(index, 1);
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
};

module.exports = {
    getAllTickets, getTicketById, createTicket, updateTicket, deleteTicket
};