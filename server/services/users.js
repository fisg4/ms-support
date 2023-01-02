const axios = require("axios");
const urlJoin = require("url-join");

const USERS_HOST = process.env.USERS_HOST;


async function getUserById(response, token, authorId) {
    const url = urlJoin(USERS_HOST, "/api/v1/users", authorId);
    try {
        const user = await axios.get(url);
        return user.data;
    } catch (error) {
        // Rollback the operation
        await messageService.unbanMessage(response, token, report.messageId, report.reviewerId.toString());
        await report.rollbackUpdateReport();
        response.status(500).send({
            "success": false,
            message: `Error getting user, reported with the status code: ${response.status}`,
            Content: error.response.data,
        });
    }
}

module.exports = {
    getUserById,
};