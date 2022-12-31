const app = require('../app');
const request = require('supertest');
const Report = require('../models/report');

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
        it("Should return all reports", () => {
            dbFind = jest.spyOn(Report, "find");
            dbFind.mockImplementation(async () => Promise.resolve(reports));

            return request(app).get("/support/v1/reports").then((response) => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toBeArrayOfSize(2);
                expect(dbFind).toBeCalled();
            });
        });

        it("Should return not found", () => {
            dbFind = jest.spyOn(Report, "find");
            dbFind.mockImplementation(async () => Promise.reject("Not found"));

            return request(app).get("/support/v1/reports").then((response) => {
                expect(response.statusCode).toBe(404);
                expect(dbFind).toBeCalled();
            });
        });
    });

    describe("Post /reports", () => {
        var dbSave;
        beforeEach(() => {
            dbSave = jest.spyOn(Report.prototype, "save");
        });

        it("Should add a new report if everything is fine", () => {
            dbSave.mockImplementation(async () => Promise.resolve(true));

            return request(app).post("/support/v1/reports").send(reports[0]).then((response) => {
                expect(response.statusCode).toBe(201);
                expect(dbSave).toBeCalled();
            });
        });

        it("Should return 400 if there is a validate problem", () => {
            const report2 = new Report({});
            dbSave.mockImplementation(async () => Promise.reject({errors: "Validation problem"}));
            
            return request(app).post("/support/v1/reports").send(report2).then((response) => {
                expect(response.statusCode).toBe(400);
                expect(dbSave).toBeCalled();
            });
        });

        it("Should return 500 if there is a problem with the conection", () => {
            dbSave.mockImplementation(async () => Promise.reject("Connection failed"));

            return request(app).post("/support/v1/reports").send(reports[0]).then((response) => {
                expect(response.statusCode).toBe(500);
                expect(dbSave).toBeCalled();
            });
        });

    });
});