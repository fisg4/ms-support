const Report = require("../models/report");
const debug = require('debug');
const sendGridService = require("../services/sendgrid");
const messageService = require("../services/messages");


/* GET all reports */
const getAllReports = async (request, response, next) => {
    try {
        const result = await Report.find();
        response.status(200).send({
            success: true,
            message: "All reports found",
            content: result
        });
    } catch (error) {
        debug("Request problem");
        response.status(404).send({
            success: true,
            message: "Not found. There are some problems with the request",
            content: null
        });
    }
    return;
};

/* GET report by id */
const getReportById = async (request, response, next) => {
    try {
        const id = request.params.id;
        const result = await Report.findById(id);
        response.send(result.cleanup());
    } catch (error) {
        debug("Database problem", error);
        response.sendStatus(404).send({ error: error.message });
    }
};

/* POST report by normal user */
const createReport = async (request, response, next) => {
    const { authorId, messageId, title, text } = request.body;
    const createDate = Date.now();
    const report = new Report({ authorId, messageId, title, text, createDate });

    try {
        await report.save();
        return response.status(201).send(report.cleanup());
    } catch (error) {
        if (error.errors) {
            debug("Validation problem when saving");
            response.status(400).send({ error: error.message });
        } else if (error.code === 11000) {
            debug("Duplicated report for the same message");
            response.status(409).send({ error: "You can not report the same message twice" });
        } else {
            debug("Database problem", error);
            response.sendStatus(500);
        }
    }
};

const sendEmailToReporter = async (response, report) => {
    // TODO: Get user email from database
    await sendGridService.sendEmail(response, report, { email: "mmolino@us.es", name: "María Elena" }, report.title);
}

const updateMessageContent = async (response, report) => {
    if (report.status === "approved") {
        await messageService.banMessage(response, report, true);
    } else {
        await messageService.banMessage(response, report, false);
    }
}

/* PATCH report by admin */
const updateReport = async (request, response, next) => {
    const { reviewerId, status } = request.body;
    const reportId = request.params.id;
    const report = await Report.findById(reportId);
    if (!report) {
        response.status(404).send({
            success: false,
            message: "Not found. There are some problems with the request",
            content: null
        });
        return;
    } else if (report.reviewerId) {
        response.status(400).send({
            success: false,
            message: "Bad request. The report has already been reviewed",
            content: null
        });
        return;
    }
    try {
        await report.updateReport(reviewerId, status);
        await updateMessageContent(response, report);
        if (report.status === "approved") {
            await sendEmailToReporter(response, report);
        }

        if (!(response.statusCode != 200)) {
            response.status(200).send({
                success: true,
                message: "All operations completed successfully.",
                content: report
            });
        }
    } catch (error) {
        if (error.errors) {
            debug("Validation problem when updating");
            response.status(400).send({
                success: false,
                message: "Validation problem when updating.",
                content: null
            });
            return;
        } else {
            // Rollback the operation
            if (report.reviewerId) await report.rollbackUpdateReport();
            await messageService.unbanMessage(response, report);
            debug("Database problem", error);
            response.status(500).send({
                success: false,
                message: "Internal server error. There are some problems with the request",
                content: null
            });
            return;
        }
    }
};

/* DELETE report by admin */
const deleteReport = async (request, response, next) => {
    const reportId = request.params.id;

    try {
        await Report.findByIdAndDelete(reportId);
        return response.sendStatus(204);
    } catch (error) {
        debug("Database problem", error);
        response.sendStatus(404).send({ error: error.message });
    }
};

module.exports = {
    getAllReports, getReportById, createReport, updateReport, deleteReport
};
