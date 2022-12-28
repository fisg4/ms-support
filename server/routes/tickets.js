const express = require('express');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

/* GET all tickets */
router.get('/', ticketController.getAllTickets);

/* GET user tickets */
router.get('/', ticketController.getUserTickets);

/* GET ticket */
router.get('/:id', ticketController.getTicket);

/* POST ticket */
router.post('/', ticketController.createTicket);

/* PATCH ticket */
router.patch('/:id', ticketController.updateTicket);

/* DELETE ticket */
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;