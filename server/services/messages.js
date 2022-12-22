const axios = require('axios');
const urlJoin = require('url-join');
const debug = require('debug');

const MESSAGES_HOST = process.env.MESSAGES_HOST;
const API_VERSION = "/api/v1";

const banMessage = async (id, isBanned, userId) => {
    try {
        const url = urlJoin(MESSAGES_HOST, API_VERSION, '/messages/', id.toString(), '/report');
        const response = await axios.patch(url, {'isBanned': isBanned}, 
                            { headers: { 'Content-Type': 'application/json', 'userId': userId}});
        debug(response);
        return response.data;
    } catch(error) {
        console.error(error);
        return null;
    }
};

module.exports = {
    banMessage
};