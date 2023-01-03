const axios = require('axios');
const urlJoin = require('url-join');
const debug = require('debug');

const SONG_HOST = "https://songs-fastmusik-marmolpen3.cloud.okteto.net";
const API_VERSION = "/api/v1";

const changeUrl = async (id, songUrl, token) => {
    try {
        const url = urlJoin(SONG_HOST, API_VERSION, '/songs');
        const response = await axios.put(url,
            { 'id': id, 'url': songUrl },
            { headers: { Authorization: `${token}` } }
        );
        console.log(response);
        return response;
    } catch (error) {
        console.error(error);
        return null;
    }
};

module.exports = {
    changeUrl
};