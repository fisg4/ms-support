const express = require('express');
const ticketController = require('../controllers/ticketController');
const passport = require("passport");

const router = express.Router();

/* GET all tickets */
router.get('/', passport.authenticate("admin", { session: false }), ticketController.getAllTickets);

/* GET all tickets by user id */
router.get('/user/:id',  passport.authenticate("user", { session: false }), ticketController.getUserTickets);

/* GET ticket by id */
router.get('/:id', passport.authenticate(["admin", "user"], { session: false }), ticketController.getTicket);

/* POST ticket by normal user */
router.post('/', passport.authenticate(["admin", "user"], { session: false }), ticketController.createTicket);

/* PATCH ticket by admin */
router.patch('/:id', passport.authenticate("user", { session: false }), ticketController.updateTicket);

/* DELETE ticket by admin */
router.delete('/:id', passport.authenticate("user", { session: false }), ticketController.deleteTicket);

module.exports = router;