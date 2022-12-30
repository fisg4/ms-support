const express = require('express');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

/* GET all tickets */
router.get('/', ticketController.getAllTickets);

/* GET all tickets by user id */
router.get('/user/:id', ticketController.getUserTickets);

/* GET ticket by id */
router.get('/:id', ticketController.getTicket);

/* POST ticket by normal user */
router.post('/', ticketController.createTicket);

/* PATCH ticket by admin */
router.patch('/:id', ticketController.updateTicket);

/* DELETE ticket by admin */
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;