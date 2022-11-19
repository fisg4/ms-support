const express = require('express');
const reportController = require('../controllers/reportController');

const router = express.Router();

/* GET all reports */
router.get('/', reportController.getAllReports);

/* GET a report */
router.get('/:id', reportController.getReportById);

/* POST a report */
router.post('/', reportController.createReport);

/* PATCH a report */
router.patch('/:id', reportController.updateReport);

/* DELETE a report */
router.delete('/:id', reportController.deleteReport);

module.exports = router;