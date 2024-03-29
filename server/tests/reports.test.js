const app = require('../app');
const request = require('supertest');
const Report = require('../models/report');
const Message = require('../services/messages');
const User = require('../services/users');
const SendGridService = require('../services/sendgrid');
const jwt = require('../auth/jwt');

const REPORT_ENDPOINT = "/support/v1/reports/";

const USER_TOKEN_JWT = jwt.generateToken({ id: '63acaac92087cbc870cb4dc7', role: 'user' });
const BAD_USER_TOKEN_JWT = jwt.generateToken({ id: '29acaac92087cbc235hn2jr0', role: 'user' });
const ADMIN_TOKEN_JWT = jwt.generateToken({ id: '63aee4412087cbc870cb4dfb', role: 'admin' });

const reports = [{
    "_id": "63b3318a3da97aba71958c75",
    "authorId": "63acaac92087cbc870cb4dc7",
    "messageId": "63b33181899ac5bfb4274737",
    "title": "Ofensive language in the message",
    "text": "This message contains hate and bad words, pls you have to do something",
    "status": "sent",
    "createDate": "2023-01-02T19:33:30.392Z",
    "__v": 0
}, {
    "_id": "63b3318a3da97aba71958s98",
    "authorId": "63acaac92087cbc870cb4dc7",
    "messageId": "6397819481f989ded88dc692",
    "title": "Ofensive language",
    "text": "This message contains hate",
    "status": "sent",
    "createDate": "2022-12-026T19:33:30.392Z",
    "__v": 0
}, {
    "_id": "639cbfae4c8d32218de27c1a",
    "authorId": "63acaac92087cbc870cb4dc7",
    "messageId": "6397819481f989ded88dc692",
    "title": "Ofensive language in the message",
    "text": "This message contains hate and bad words, pls you have to do something",
    "status": "approved",
    "createDate": "2022-12-16T18:57:50.799Z",
    "__v": 0,
    "reviewerId": "63aee4412087cbc870cb4dfb",
    "updateDate": "2022-12-16T20:24:50.924Z"
}
];

describe("GET /", () => {
    it("Should return an sentence", () => {
        return request(app).get("/").then((response) => {
            expect(response.status).toBe(200);
        });
    });
});

describe("Reports API", () => {

    describe("GET /reports", () => {
        let findAllReportsMock;
        beforeEach(() => {
            findAllReportsMock = jest.spyOn(Report, 'find');
        });

        it("Should return all reports", async () => {
            findAllReportsMock.mockImplementation(async () => Promise.resolve(reports));

            return request(app).get(REPORT_ENDPOINT)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT
                ).then((response) => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body.content).toBeArrayOfSize(3);
                    expect(findAllReportsMock).toBeCalled();
                });
        });

        it("Should return internal server error", () => {
            findAllReportsMock.mockImplementation(async () => Promise.reject("Internal server error"));

            return request(app).get(REPORT_ENDPOINT)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT
                ).then((response) => {
                    expect(response.statusCode).toBe(500);
                    expect(findAllReportsMock).toBeCalled();
                });
        });
    });

    describe("GET /reports/user/:id", () => {
        let findReportByUserIdMock;
        beforeEach(() => {
            findReportByUserIdMock = jest.spyOn(Report, 'find');
        });

        it('Should return Unauthorized when user/admin try to read all reports from another user', () => {
            const authorId = reports[0].authorId;

            return request(app).get(REPORT_ENDPOINT + "user/" + authorId)
                .set("Authorization",
                    "Bearer " + BAD_USER_TOKEN_JWT)
                .then((response) => {
                    expect(response.status).toBe(401);
                });
        });

        it('Should return OK when AUTHOR search his/her own reports', () => {
            const authorId = reports[0].authorId;
            findReportByUserIdMock.mockImplementation(async () => Promise.resolve(reports));

            return request(app).get(REPORT_ENDPOINT + "user/" + authorId)
                .set(
                    "Authorization",
                    "Bearer " + USER_TOKEN_JWT
                ).then((response) => {
                    expect(response.status).toBe(200);
                    expect(findReportByUserIdMock).toBeCalled();
                });
        });

        it("Should return internal server error", () => {
            const authorId = reports[0].authorId;
            findReportByUserIdMock.mockImplementation(async () => Promise.reject("Internal server error"));

            return request(app).get(REPORT_ENDPOINT + "user/" + authorId)
                .set(
                    "Authorization",
                    "Bearer " + USER_TOKEN_JWT
                ).then((response) => {
                    expect(response.status).toBe(500);
                    expect(findReportByUserIdMock).toBeCalled();
                });
        });
    });

    describe("GET /reports/:id", () => {
        let findReportByIdMock;
        beforeEach(() => {
            findReportByIdMock = jest.spyOn(Report, 'findById');
        });

        it('Should return Unauthorized when user try to read a report from another user', () => {
            const reportId = reports[0]._id;
            findReportByIdMock.mockImplementation(async (reportId) => Promise.resolve(reports[0]));

            return request(app).get(REPORT_ENDPOINT + reportId)
                .set("Authorization",
                    "Bearer " + BAD_USER_TOKEN_JWT
                ).then((response) => {
                    expect(response.status).toBe(401);
                    expect(findReportByIdMock).toBeCalled();
                });
        });

        it('Should return OK when ADMIN searching with an existing id', () => {
            const reportId = reports[0]._id;
            findReportByIdMock.mockImplementation(async (reportId) => Promise.resolve(reports[0]));

            return request(app).get(REPORT_ENDPOINT + reportId)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT
                ).then((response) => {
                    expect(response.status).toBe(200);
                    expect(response.body.content.authorId).toBe(reports[0].authorId);
                    expect(findReportByIdMock).toBeCalled();
                });
        });

        it('Should return OK when USER searching with an existing id', () => {
            const reportId = reports[0]._id;
            findReportByIdMock.mockImplementation(async (reportId) => Promise.resolve(reports[0]));

            return request(app).get(REPORT_ENDPOINT + reportId)
                .set(
                    "Authorization",
                    "Bearer " + USER_TOKEN_JWT
                ).then((response) => {
                    expect(response.status).toBe(200);
                    expect(response.body.content.authorId).toBe(reports[0].authorId);
                    expect(findReportByIdMock).toBeCalledWith(reportId);
                });
        });

        it('Should return NOT_FOUND when searching with a non existing id', () => {
            const reportId = "10b4456a2da87aba71958c00";
            findReportByIdMock.mockImplementation(async (reportId) => Promise.resolve(null));

            return request(app).get(REPORT_ENDPOINT + reportId)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT
                )
                .then((response) => {
                    expect(response.status).toBe(404);
                    expect(findReportByIdMock).toBeCalledWith(reportId);
                });
        });

        it('Should return Internal Server Error when the request is invalid', () => {
            const reportInvalidId = "invalidId";
            findReportByIdMock.mockImplementation(async (reportInvalidId) => Promise.reject(500));

            return request(app).get(REPORT_ENDPOINT + reportInvalidId)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT
                )
                .then((response) => {
                    expect(response.status).toBe(500);
                    expect(findReportByIdMock).toBeCalledWith(reportInvalidId);
                });
        });
    });

    describe("Post /reports", () => {
        var saveReportMock;
        beforeEach(() => {
            saveReportMock = jest.spyOn(Report, "createReport");
        });

        it("Should return 401 if user is not authenticate", () => {

            return request(app).post(REPORT_ENDPOINT)
                .send(reports[0])
                .then((response) => {
                    expect(response.statusCode).toBe(401);
                });
        });

        it("Should add a new report if everything is fine", () => {
            saveReportMock.mockImplementation(async () => Promise.resolve(true));

            return request(app).post(REPORT_ENDPOINT).send(reports[0]).set(
                "Authorization",
                "Bearer " + USER_TOKEN_JWT
            ).then((response) => {
                expect(response.statusCode).toBe(201);
                expect(saveReportMock).toBeCalled();
            });
        });

        it("Should return 400 if there is a validate problem", () => {
            invalidMessageId = "invalidId";
            saveReportMock.mockImplementation(async () => Promise.reject({ errors: 'BSONTypeError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer' }));

            return request(app).post(REPORT_ENDPOINT)
                .set(
                    "Authorization",
                    "Bearer " + USER_TOKEN_JWT
                ).send({
                    authorId: "63acaac92087cbc870cb4dc7",
                    messageId: invalidMessageId,
                    title: "Ofensive language in the message",
                    text: "This message contains hate and bad words"
                }).then((response) => {
                    expect(response.statusCode).toBe(400);
                    expect(saveReportMock).toBeCalled();
                });
        });

        it("Should return Conflict when trying to duplicate the report for the same message", () => {
            saveReportMock.mockImplementation(async () => Promise.reject({ code: 11000 }));

            return request(app).post(REPORT_ENDPOINT)
                .send(reports[0])
                .set(
                    "Authorization",
                    "Bearer " + USER_TOKEN_JWT
                ).then((response) => {
                    expect(response.statusCode).toBe(409);
                    expect(saveReportMock).toBeCalled();
                });
        });

        it("Should return 500 if there is a problem with the conection", () => {
            saveReportMock.mockImplementation(async () => Promise.reject("Internal server error"));

            return request(app).post(REPORT_ENDPOINT)
                .send({
                    authorId: "63acaac92087cbc870cb4dc7",
                    messageId: "63b33181899ac5bfb4274737",
                    title: "Ofensive language in the message",
                    text: "This message contains hate and bad words"
                }).set(
                    "Authorization",
                    "Bearer " + USER_TOKEN_JWT
                ).then((response) => {
                    expect(response.statusCode).toBe(500);
                    expect(saveReportMock).toBeCalled();
                });
        });
    });

describe("Update /reports/:id", () => {
    var updateReportMock;
    var updateRollbackMock;
    var findReportByIdMock;
    var bannedMessageMock;
    var sendGridServiceMock;
    var findUserByIdMock;

    let reportUpdatedRejected = new Report({
        "_id": "63b3318a3da97aba71958c75",
        "authorId": "63acaac92087cbc870cb4dc7",
        "messageId": "63b33181899ac5bfb4274737",
        "title": "Ofensive language in the message",
        "text": "This message contains hate and bad words, pls you have to do something",
        "status": "rejected",
        "createDate": "2023-01-02T19:33:30.392Z",
        "__v": 0,
        "reviewerId": "63aee4412087cbc870cb4dfb",
        "updateDate": "2022-12-16T20:24:50.924Z"
    });

    let reportUpdatedApproved = new Report({
        "_id": "63b3318a3da97aba71958c34",
        "authorId": "63acaac92087cbc870cb4dc2",
        "messageId": "63b33181899ac5bfb4274733",
        "title": "Ofensive language in the message",
        "text": "This message contains hate and bad words, pls you have to do something",
        "status": "approved",
        "createDate": "2023-01-02T19:33:30.392Z",
        "__v": 0,
        "reviewerId": "63aee4412087cbc870cb4dfb",
        "updateDate": "2022-12-16T20:24:50.924Z"
    });

    let reportRollback = new Report({
        "_id": "63b3318a3da97aba71958c75",
        "authorId": "63acaac92087cbc870cb4dc7",
        "messageId": "63b33181899ac5bfb4274737",
        "title": "Ofensive language in the message",
        "text": "This message contains hate and bad words, pls you have to do something",
        "status": "sent",
        "createDate": "2023-01-02T19:33:30.392Z",
        "__v": 0,
        "reviewerId": null,
        "updateDate": null
    });

    beforeEach(() => {
        updateReportMock = jest.spyOn(Report.prototype, "updateReport");
        updateRollbackMock = jest.spyOn(Report.prototype, "rollbackUpdateReport");
        findReportByIdMock = jest.spyOn(Report, 'findById');
        bannedMessageMock = jest.spyOn(Message, "banMessage");
        sendGridServiceMock = jest.spyOn(SendGridService, "sendEmail");
        findUserByIdMock = jest.spyOn(User, "getUserById");
    });

    it("Should return 401 if user is not authenticate", () => {
        const reportId = reports[0]._id;

        return request(app).patch(REPORT_ENDPOINT + reportId)
            .then((response) => {
                expect(response.statusCode).toBe(401);
            });
    });

    it("Should return 401 if user is authenticate", () => {
        const reportId = reports[0]._id;

        return request(app).patch(REPORT_ENDPOINT + reportId)
            .set(
                "Authorization",
                "Bearer " + USER_TOKEN_JWT
            )
            .then((response) => {
                expect(response.statusCode).toBe(401);
            });
    });


    it("Should return 404 if the report does not exist", () => {
        const reportId = "invalidId";
        findReportByIdMock.mockImplementation(async (reportId) => Promise.resolve(null));

        return request(app).patch(REPORT_ENDPOINT + reportId)
            .set(
                "Authorization",
                "Bearer " + ADMIN_TOKEN_JWT
            )
            .then((response) => {
                expect(response.statusCode).toBe(404);
                expect(findReportByIdMock).toBeCalledWith(reportId);
            });
    });

    it("Should return 409 if report has been reviewed yet", () => {
        const reportId = reports[2]._id;
        findReportByIdMock.mockImplementation(async (reportId) => Promise.resolve(reports[2]));

        return request(app).patch(REPORT_ENDPOINT + reportId)
            .set(
                "Authorization",
                "Bearer " + ADMIN_TOKEN_JWT
            )
            .then((response) => {
                expect(response.statusCode).toBe(409);
                expect(findReportByIdMock).toBeCalledWith(reportId);
            });
    });

    it("Should return 200 if the report has been rejected correctly", () => {
        const reportId = reports[0]._id; const reviewerId = "63aee4412087cbc870cb4dfb";
        const status = "rejected"; const response = {};
        const report = reportUpdatedRejected; const banned = false;
        findReportByIdMock.mockImplementation(async (reportId) => Promise.resolve(new Report(reports[0])));
        updateReportMock.mockImplementation(async (reviewerId, status) => Promise.resolve(reportUpdatedRejected));
        bannedMessageMock.mockImplementation(async (response, report, banned) => Promise.resolve(true));

        return request(app).patch(REPORT_ENDPOINT + reportId)
            .set(
                "Authorization",
                "Bearer " + ADMIN_TOKEN_JWT
            ).send({
                status: status
            })
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(findReportByIdMock).toBeCalledWith(reportId);
                expect(updateReportMock).toBeCalled();
                expect(bannedMessageMock).toBeCalled();
            });
    });

    it("Should return 200 if the report has been approved correctly", () => {
        const reportId = reports[0]._id; const reviewerId = "63aee4412087cbc870cb4dfb";
        const status = "approved"; const response = {};
        const report = reportUpdatedApproved; const banned = true;
        findReportByIdMock.mockImplementation(async (reportId) => Promise.resolve(new Report(reports[0])));
        updateReportMock.mockImplementation(async (reviewerId, status) => Promise.resolve(reportUpdatedApproved));
        bannedMessageMock.mockImplementation(async (response, report, banned) => Promise.resolve(true));
        findUserByIdMock.mockImplementation(async (userId) => Promise.resolve({ email: "marmolpen3@alum.us.es", "username": "marmolpen3"}));
        sendGridServiceMock.mockImplementation(async (response, report) => Promise.resolve(true));

        return request(app).patch(REPORT_ENDPOINT + reportId)
            .set(
                "Authorization",
                "Bearer " + ADMIN_TOKEN_JWT
            ).send({
                status: status
            })
            .then((response) => {
                expect(response.statusCode).toBe(200);
                expect(findReportByIdMock).toBeCalledWith(reportId);
                expect(updateReportMock).toBeCalled();
                expect(bannedMessageMock).toBeCalled();
                expect(sendGridServiceMock).toBeCalled();
            });
    });

    it("Should return 500 if the report has been approved correctly but the message integration fail", () => {
        const reportId = reports[0]._id; const reviewerId = "63aee4412087cbc870cb4dfb";
        const status = "approved"; const response = {};
        const report = reportUpdatedApproved; const banned = true;
        const oldReviewerId = null; const oldStatus = "sent";
        findReportByIdMock.mockImplementation(async (reportId) => Promise.resolve(new Report(reports[0])));
        updateReportMock.mockImplementation(async (reviewerId, status) => Promise.resolve(reportUpdatedApproved));
        bannedMessageMock.mockImplementation(async (response, report, banned) => Promise.reject("Internal server error"));
        updateRollbackMock.mockImplementation(async (oldReviewerId, oldStatus) => Promise.resolve(reportRollback));

        return request(app).patch(REPORT_ENDPOINT + reportId)
            .set(
                "Authorization",
                "Bearer " + ADMIN_TOKEN_JWT
            ).send({
                status: status
            })
            .then((response) => {
                expect(response.statusCode).toBe(500);
                expect(findReportByIdMock).toBeCalledWith(reportId);
                expect(updateReportMock).toBeCalled();
                expect(bannedMessageMock).toBeCalled();
                expect(sendGridServiceMock).toBeCalled();
            });
    });
});

describe("Delete /reports/:id", () => {
    var deleteReportByIdMock;
    beforeEach(() => {
        deleteReportByIdMock = jest.spyOn(Report, "findByIdAndDelete");
    });

    it("Should return 401 if user is not authenticate", () => {
        const reportId = reports[0]._id;

        return request(app).delete(REPORT_ENDPOINT + reportId)
            .then((response) => {
                expect(response.statusCode).toBe(401);
            });
    });

    it("Should return 401 if user is authenticate", () => {
        const reportId = reports[0]._id;

        return request(app).delete(REPORT_ENDPOINT + reportId)
            .set(
                "Authorization",
                "Bearer " + USER_TOKEN_JWT
            )
            .then((response) => {
                expect(response.statusCode).toBe(401);
            });
    });

    it("Should return Not Content if ADMIN is authenticate and the report is deleted", () => {
        const reportId = reports[0]._id;
        deleteReportByIdMock.mockImplementation(async (reportId) => Promise.resolve(true));

        return request(app).delete(REPORT_ENDPOINT + reportId)
            .set(
                "Authorization",
                "Bearer " + ADMIN_TOKEN_JWT
            ).then((response) => {
                expect(response.statusCode).toBe(204);
                expect(deleteReportByIdMock).toBeCalledWith(reportId);
            });
    });
});
});