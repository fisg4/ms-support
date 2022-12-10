const express = require('express');
const reportController = require('../controllers/reportController');

const router = express.Router();

/* GET all reports */
router.get('/', reportController.getAllReports);

/* GET report by id */
router.get('/:id', reportController.getReportById);

/* POST report by normal user */
router.post('/', reportController.createReport);

/* PATCH report by admin */
router.patch('/:id', reportController.updateReport);

/* DELETE report by admin */
router.delete('/:id', reportController.deleteReport);

module.exports = router;