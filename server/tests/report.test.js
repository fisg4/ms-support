const app = require('../app');
const request = require('supertest');
const Report = require('../models/report')

describe("Reports API", () => {
    describe("GET /", () => {
        it("Should return an sentence", () => {
            return request(app).get("/").then((response) => {
                expect(response.status).toBe(200);
            })
        })
    });

    describe("GET /reports", () => {
        it("Should return all reports", () => {
           const reports = [
                new Report({
                    "authorId": "637d0c328a43d958f6ff662b",
                    "messageId": "6397819481f989ded88dc693",
                    "title": "The message contains ofensive language",
                    "text": "This message contains hate and bad words"
                }),
                new Report({
                    "authorId": "637d0c328a43d958f6ff661b",
                    "messageId": "6397819481f989ded88dc692",
                    "title": "Ofensive language in the message",
                    "text": "This message contains hate and bad words, pls you have to do something"
                })
           ]

           dbFind = jest.spyOn(Report, "find");
           dbFind.mockImplementation(async () => Promise.resolve(reports));

           return request(app).get("/support/v1/reports").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
                expect(dbFind).toBeCalled();
           })
        })
    });
});