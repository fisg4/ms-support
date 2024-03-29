const axios = require('axios');
const urlJoin = require('url-join');
const debug = require('debug');

const SONGS_HOST = process.env.SONGS_HOST;
const API_VERSION = "/api/v1";

const changeUrl = async (id, songUrl, token) => {
    try {
        const url = urlJoin(SONGS_HOST, API_VERSION, '/songs');
        const response = await axios.put(url,
            { 'id': id, 'url': songUrl },
            { headers: { Authorization: `${token}` } }
        );
        return response;
    } catch (error) {
        response.status(500).send({
            success: false,
            message: 'Something went wrong...',
            content: {}
        });
        return false;
    }
};

module.exports = {
    changeUrl
};
