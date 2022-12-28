const express = require('express');
const ticketController = require('../controllers/ticketController');
const passport = require("passport");

const router = express.Router();

/* GET all tickets */
router.get('/', passport.authenticate("admin", { session: false }), ticketController.getAllTickets);

/* GET ticket */
router.get('/:id', passport.authenticate(["admin", "user"], { session: false }), ticketController.getTicketById);

/* POST ticket */
router.post('/', passport.authenticate(["admin", "user"], { session: false }), ticketController.createTicket);

/* PATCH ticket */
router.patch('/:id', passport.authenticate("admin", { session: false }), ticketController.updateTicket);

/* DELETE ticket */
router.delete('/:id', passport.authenticate("admin", { session: false }), ticketController.deleteTicket);

module.exports = router;