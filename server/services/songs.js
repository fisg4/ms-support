const axios = require('axios');
const urlJoin = require('url-join');
const debug = require('debug');

const SONG_HOST = process.env.SONG_HOST;
const API_VERSION = "/api/v1";

const changeUrl = async (id, songUrl) => {
    try {
        const url = urlJoin("https://songs-fastmusik-marmolpen3.cloud.okteto.net", API_VERSION, '/songs/');
        const response = await axios.put(url, {'id': id, 'url': songUrl});
        return response.status;
    } catch(error) {
        console.error(error);
        return null;
    }
};

module.exports = {
    changeUrl
};