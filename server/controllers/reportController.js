const Report = require("../models/report");
const debug = require('debug');
const sendGridService = require("../services/sendgrid");
const messageService = require("../services/messages");
const {decodeToken} = require("../auth/jwt");


/* GET all reports */
const getAllReports = async (request, response, next) => {
    try {
        const result = await Report.find();
        if (result.length === 0) {
            response.status(404).send({
                success: false,
                message: "No reports found",
                content: null
            });
            return;
        }
        response.status(200).send({
            success: true,
            message: "All reports found",
            content: result
        });
    } catch (error) {
        debug("Request problem");
        response.status(500).send({
            success: false,
            message: "Internal server error. Error getting reports",
            content: null
        });
    }
};

/* GET all reports by user id */
const getAllReportsByUserId = async (request, response, next) => {
    const token = request.headers.authorization;
    const decodedToken = decodeToken(token);
    const id = request.params.id;

    if (decodedToken.id !== id) {
        response.status(401).send({
            success: false,
            message: "Unauthorized. You can only read your own reports",
            content: null
        });
        return;
    }

    try {
        const result = await Report.find({ authorId: id });
        if (result.length === 0) {
            response.status(404).send({
                success: false,
                message: `No reports found for user with id '${id}' `,
                content: null
            });
            return;
        }

        response.status(200).send({
            success: true,
            message: "All reports found",
            content: result
        });
    } catch (error) {
        debug("Request problem");
        response.status(500).send({
            success: false,
            message: `Internal server error. Error getting reports of the user with id '${id}'.`,
            content: null
        });
    }
};

/* GET report by id */
const getReportById = async (request, response, next) => {
    const token = request.headers.authorization;
    const decodedToken = decodeToken(token);
    const id = request.params.id;

    if (decodedToken.role !== "admin" && decodedToken.id !== id) {
        response.status(401).send({
            success: false,
            message: "Unauthorized. You can only read your own reports",
            content: null
        });
        return;
    }

    try {
        const result = await Report.findById(id);
        if (!result) {
            response.status(404).send({
                success: false,
                message: `Report with id '${id}' not found`,
                content: null
            });
            return;
        }
        response.status(200).send({
            success: true,
            message: "All reports found",
            content: result
        });
    } catch (error) {
        debug("Request problem");
        response.status(500).send({
            success: false,
            message: `Error getting report with id '${id}'. Review the request`,
            content: null
        });
    }
};

/* POST report by normal user */
const createReport = async (request, response, next) => {
    const token = request.headers.authorization;
    const decodedToken = decodeToken(token);
    const { authorId, messageId, title, text } = request.body;

    if (decodedToken.id !== authorId) {
        response.status(401).send({
            success: false,
            message: "Unauthorized. You can only create reports for yourself",
            content: null
        });
        return;
    }

    try {
        const report = await Report.createReport(authorId, messageId, title, text);
        response.status(201).send({
            success: true,
            message: "Report created successfully",
            content: report
        });
    } catch (error) {
        if (error.errors) {
            debug("Validation problem when saving");
            response.status(400).send({
                success: false,
                message: "Validation problem when updating.",
                content: null
            });
        } else if (error.code === 11000) {
            debug("Duplicated report for the same message");
            response.status(409).send({
                success: false,
                message: "Message can not be reported twice",
                content: null
            });
        } else {
            debug("System problem", error);
            response.status(500).send({
                success: false,
                message: "Internal server error. There are some problems with the request",
                content: null
            });
        }
    }
};

const sendEmailToReporter = async (response, token, report) => {
    // TODO: Get user email from database
    await sendGridService.sendEmail(response, token, report, { email: "mmolino@us.es", name: "María Elena" }, report.title);
}

const updateMessageContent = async (response, token, report) => {
    if (report.status === "approved") {
        await messageService.banMessage(response, token, report, true);
    } else {
        await messageService.banMessage(response, token, report, false);
    }
}

/* PATCH report by admin */
const updateReport = async (request, response, next) => {
    const token = request.headers.authorization;
    const decodedToken = decodeToken(token);
    const { reviewerId, status } = request.body;
    const reportId = request.params.id;

    if (decodedToken.id !== reviewerId) {
        response.status(401).send({
            success: false,
            message: "Unauthorized. You can only update reports for yourself",
            content: null
        });
        return;
    }

    const report = await Report.findById(reportId);
    if (!report) {
        response.status(404).send({
            success: false,
            message: "Report not found. There are some problems with the request",
            content: null
        });
        return;
    } else if (report.reviewerId) {
        response.status(409).send({
            success: false,
            message: "Bad request. The report has already been reviewed",
            content: null
        });
        return;
    }
    try {
        await report.updateReport(reviewerId, status);
        await updateMessageContent(response, token, report);
        if (report.status === "approved") {
            await sendEmailToReporter(response, token, report);
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
        } else {
            // Rollback the operation
            if (report.reviewerId) await report.rollbackUpdateReport();
            await messageService.unbanMessage(response, token, report);
            debug("System problem", error);
            response.status(500).send({
                success: false,
                message: "Internal server error. There are some problems with the request",
                content: null
            });
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
        debug("Request problem", error);
        response.sendStatus(404).send({
            success: false,
            message: "Not found. There are some problems with the request",
            content: null
        });
    }
};

module.exports = {
    getAllReports, getAllReportsByUserId, getReportById, createReport, updateReport, deleteReport
};
