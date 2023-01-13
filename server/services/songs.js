const axios = require('axios');
const urlJoin = require('url-join');
const debug = require('debug');

const SONG_HOST = process.env.SONG_HOST;
const API_VERSION = "/api/v1";

const changeUrl = async (id, songUrl, token) => {
    try {
        const url = urlJoin(SONG_HOST, API_VERSION, '/songs');
        const response = await axios.put(url,
            { 'id': id, 'url': songUrl },
            { headers: { Authorization: `${token}` } }
        );
        return response;
    } catch (error) {
        console.error(error);
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
