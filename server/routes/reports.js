const express = require('express');
const reportController = require('../controllers/reportController');
const passport = require("passport");

const router = express.Router();

/* GET all reports */
router.get('/', passport.authenticate("admin", { session: false }), reportController.getAllReports);

/* GET all reports by user id */
router.get('/user/:id', passport.authenticate("user", { session: false }), reportController.getAllReportsByUserId);

/* GET report by id */
router.get('/:id', passport.authenticate(["admin", "user"], { session: false }), reportController.getReportById);

/* POST report by normal user */
router.post('/', passport.authenticate("user", { session: false }), reportController.createReport);

/* PATCH report by admin */
router.patch('/:id', passport.authenticate("admin", { session: false }), reportController.updateReport);

/* DELETE report by admin */
router.delete('/:id', passport.authenticate("admin", { session: false }), reportController.deleteReport);

module.exports = router;