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

const getAllTickets = (req, res, next) => {
        res.send(ticketDb);
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

const createTicket = (req, res, next) => {
    var ticket = req.body;
    const lastTicketId = ticketDb.length;

    var newTicket = {
        ...ticket,
        id: lastTicketId+1,
        date: Date.now(),
        status: 'sent',
        priority: 'low'
    }

    ticketDb.push(newTicket);

    res.sendStatus(201);
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