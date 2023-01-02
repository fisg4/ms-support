const app = require('../app');
const request = require('supertest');
const Report = require('../models/report');
const jwt = require('../auth/jwt');

const REPORT_ENDPOINT = "/support/v1/reports";
const USER_TOKEN_JWT = jwt.generateToken({ id: '63acaac92087cbc870cb4dc7', role: 'user'});
const ADMIN_TOKEN_JWT = jwt.generateToken({ id: '63aee4412087cbc870cb4dfb', role: 'admin'});

const reports = [{
        "authorId": "63acaac92087cbc870cb4dc7",
        "messageId": "6397819481f989ded88dc693",
        "title": "The message contains ofensive language",
        "text": "This message contains hate and bad words"
    }, {
        "authorId": "63acaac92087cbc870cb4dc7",
        "messageId": "6397819481f989ded88dc692",
        "title": "Ofensive language in the message",
        "text": "This message contains hate and bad words, pls you have to do something"
    }
];

describe("Reports API", () => {

    describe("GET /", () => {
        it("Should return an sentence", () => {
            return request(app).get("/").then((response) => {
                expect(response.status).toBe(200);
            });
        });
    });

    describe("GET /reports", () => {
        it("Should return all reports", async () => {
            dbFind = jest.spyOn(Report, "find");
            dbFind.mockImplementation(async () => Promise.resolve(reports));

            const response = await request(app).get(REPORT_ENDPOINT).set(
                "Authorization",
                "Bearer " + ADMIN_TOKEN_JWT
            );
            expect(response.statusCode).toBe(200);
            expect(response.body.content).toBeArrayOfSize(2);
            expect(dbFind).toBeCalled();
        });

        it("Should return internal server error", () => {
            dbFind = jest.spyOn(Report, "find");
            dbFind.mockImplementation(async () => Promise.reject("Internal server error"));

            return request(app).get(REPORT_ENDPOINT).set(
                "Authorization",
                "Bearer " + ADMIN_TOKEN_JWT
            ).then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbFind).toBeCalled();
            });
        });
    });
});