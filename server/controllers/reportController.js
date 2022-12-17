const Report = require("../models/report");
const debug = require('debug');
const sendGridService = require("../services/sendgrid");
const messageService = require("../services/messages");


/* GET all reports */
const getAllReports = async (request, response, next) => {
    try {
        const result = await Report.find();
        response.send(result.map((report) => report.cleanup()));
    } catch (error) {
        debug("Database problem", error);
        response.sendStatus(404).send({error: error.message});
    }
};

/* GET report by id */
const getReportById = async (request, response, next) => {
    try {
        const id = request.params.id;
        const result = await Report.findById(id);
        response.send(result.cleanup());
    } catch (error) {
        debug("Database problem", error);
        response.sendStatus(404).send({error: error.message});
    }
};

/* POST report by normal user */
const createReport = async (request, response, next) => {
    const {authorId, messageId, title, text} = request.body;
    const createDate = Date.now();
    const report = new Report({ authorId, messageId, title, text, createDate });

    try {
        await report.save();
        return response.status(201).send(report.cleanup());
    } catch (error) {
        if (error.errors) {
            debug("Validation problem when saving");
            response.status(400).send({error: error.message});
        } else {
            debug("Database problem", error);
            response.sendStatus(500);
        }
    }
};

const sendEmailToReporter = async (report) => {
    try {
        const res = await sendGridService.sendEmail({email: "mmolino@us.es", name: "María Elena"}, report.title);
        return response.sendStatus(res.status)
    } catch (error) {
        debug("Services Problem");
        response.send({error: error.message});
    }
}

const updateMessageContent = async (report) => {
    try {
        if (report.status === "approved") {
            await messageService.banMessage(report.messageId, true, report.authorId.toString());
        } else {
            await messageService.banMessage(report.messageId, false, report.authorId.toString());
        }
        return response.sendStatus(200)
    } catch (error) {
        debug("Services Problem");
        response.send({error: error.message});
    }
}

/* PATCH report by admin */
const updateReport = async (request, response, next) => {
    const {reviewerId, status} = request.body;
    const updateDate = Date.now()
    const reportId = request.params.id;

    try {
        const report = await Report.findById(reportId);
        report.reviewerId = reviewerId; report.status = status; report.updateDate = updateDate
        await report.save();
        await updateMessageContent(report);
        if (report.status === "approved") {
            await sendEmailToReporter(report);
        }
        return response.sendStatus(201);
    } catch (error) {
        if (error.errors) {
            debug("Validation problem when updating");
            response.status(400).send({error: error.message});
        } else {
            debug("Database problem", error);
            response.sendStatus(500);
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
        response.sendStatus(404).send({error: error.message});
    }
};

module.exports = {
    getAllReports, getReportById, createReport, updateReport, deleteReport
};
