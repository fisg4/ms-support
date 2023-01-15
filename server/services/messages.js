const axios = require('axios');
const urlJoin = require('url-join');
const debug = require('debug');

const MESSAGES_HOST = process.env.MESSAGES_HOST || "http://localhost:3002";
const API_VERSION = "/api/v1";

const banMessage = async (response, report, isBanned) => {
    const url = urlJoin(MESSAGES_HOST, API_VERSION, '/messages/', report.messageId.toString(), '/report');
    try {
        const bannedMessage = await axios.patch(url, { 'isBanned': isBanned },
            { headers: { 'Content-Type': 'application/json'} });
        return bannedMessage.data.content;
    } catch (error) {
        response.status(500).send({
            "success": false,
            messageServiceStatus: error.response.status,
            messageContent: error.response.data,
        });
        return false;
    }
};

const unbanMessage = async (response, report) => {
    const url = urlJoin(MESSAGES_HOST, API_VERSION, '/messages/', report.messageId.toString(), '/unban');
    try {
        await axios.patch(url, {}, { headers: { 'Content-Type': 'application/json'} });
    } catch (error) {
        response.status(500).send({
            "success": false,
            messageServiceStatus: error.response.status,
            messageServiceContent: error.response.data,
        });
    }
};

module.exports = {
    banMessage,
    unbanMessage
};