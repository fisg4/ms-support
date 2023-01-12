const axios = require("axios");
const urlJoin = require("url-join");

const USERS_HOST = process.env.USERS_HOST;

const getUserById = async (response, authorId) => {
    const url = urlJoin(USERS_HOST, "/api/v1/users/", authorId.toString());
    try {
        const user = await axios.get(url);
        return user.data;
    } catch (error) {
        response.status(500).send({
            success: false,
            message: `Error getting user, reported with the status code: ${response.status}`,
            content: error.response.data,
        });
        return false;
    }
}

module.exports = {
    getUserById,
};