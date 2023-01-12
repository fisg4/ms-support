const Report = require("../models/report");
const debug = require('debug');
const sendGridService = require("../services/sendgrid");
const userService = require("../services/users");
const messageService = require("../services/messages");
const {decodeToken} = require("../auth/jwt");


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

        if (decodedToken.role !== "admin" && decodedToken.id !== result.authorId) {
            response.status(401).send({
                success: false,
                message: "Unauthorized. You can only read your own reports",
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

const rollBackReport = async (response, report, bannedMessage) => {
    if (report.reviewerId) await report.rollbackUpdateReport();
    if (bannedMessage) await messageService.unbanMessage(response, report);
}

const sendEmailToReporter = async (response, report, bannedMessage) => {
    const user = await userService.getUserById(response, report.authorId);
    if (user === false) {
        //Rollback operation
        await rollBackReport(response, report, bannedMessage);
    } else {
        const sendEmail = await sendGridService.sendEmail(response, user, report.title);
        //Rollback operation
        if (sendEmail === false) await rollBackReport(response, report, bannedMessage);
    }
}

/* PATCH report by admin */
const updateReport = async (request, response, next) => {
    const token = request.headers.authorization;
    const decodedToken = decodeToken(token);
    const { status } = request.body;
    const reportId = request.params.id;
    let bannedMessage;

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
        await report.updateReport(decodedToken.id, status);
        bannedMessage = await messageService.banMessage(response, report, report.status === "approved");
        //Rollback operation
        if (bannedMessage === false && report.reviewerId) await report.rollbackUpdateReport();
        
        if (report.status === "approved") await sendEmailToReporter(response, report, bannedMessage);
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
            //Rollback operation
            await rollBackReport(response, report, bannedMessage);
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
