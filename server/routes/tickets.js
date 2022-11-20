const express = require('express');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

/* GET all tickets */
router.get('/', ticketController.getAllTickets);

/* GET ticket */
router.get('/:id', ticketController.getTicketById);

/* POST ticket */
router.post('/', ticketController.createTicket);

/* PATCH ticket */
router.patch('/:id', ticketController.updateTicket);

/* DELETE ticket */
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;