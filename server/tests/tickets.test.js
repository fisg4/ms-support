const app = require('../app');
const request = require('supertest');
const Ticket = require('../models/Ticket');
const jwt = require('../auth/jwt');

const tickets = [
    new Ticket({
        "authorId": "63acaac92087cbc870cb4dc7",
        "title": "First ticket of the year",
        "text": "This ticket is the first of 2023",
        "status": "sent",
        "priority": "low",
        "createDate": new Date('January 1, 2023 00:00:00')
    }),
    new Ticket({
        "authorId": "63aee4412087cbc870cb4dfb",
        "title": "Second ticket",
        "text": "Now we have two tickets",
        "status": "rejected",
        "priority": "medium",
        "createDate": new Date('January 2, 2023 14:32:25')
    })
];

const BASE_PATH = "support/v1";
const USER_TOKEN_JWT = jwt.generateToken({ id: '63acaac92087cbc870cb4dc7', role: 'user' });
const ADMIN_TOKEN_JWT = jwt.generateToken({ id: '63aee4412087cbc870cb4dfb', role: 'admin' });


describe("Tickets API", () => {

    describe("GET /tickets", () => {

        it("Should return all tickets", () => {
            dbFind = jest.spyOn(Ticket, "find");
            dbFind.mockImplementation(async () => Promise.resolve(tickets));

            return request(app).get("/support/v1/tickets")
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT)
                .then((response) => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body).toBeArrayOfSize(2);
                    expect(dbFind).toBeCalled();
                });
        });

        it("Should return DB error", () => {
            dbFind = jest.spyOn(Ticket, "find");
            dbFind.mockImplementation(async () => Promise.reject("Not found"));

            return request(app).get(`${BASE_PATH}/tickets`)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT)
                .then((response) => {
                    expect(response.statusCode).toBe(500);
                    expect(dbFind).toBeCalled();
                });
        });
    });

    describe("GET tickets/user/:id", () => {

        const userId = "dummy-user-id";

        it('Should return 200 when searching with an existing user that created tickets', () => {
            getByIdMock.mockImplementation(async (ticketId) => Promise.resolve(tickets));

            return request(app).get(`${BASE_PATH}/tickets/user/${userId}`).then((response) => {
                expect(response.status).toBe(200);
                expect(response.body.content.text).toBe(ticket.text);
                expect(getByIdMock).toBeCalledWith(ticketId);
            });
        });

        it('Should return 404 when searching with an unexisting user id', () => {
            const wrongId = 'dummy-wrong-id';
            getByIdMock.mockImplementation(async (wrongId) => Promise.resolve(null));

            return request(app).get(`${BASEPATH}/tickets/${wrongId}`).then((response) => {
                expect(response.status).toBe(404);
                expect(getByIdMock).toBeCalledWith(wrongId);
            });
        });
    });

    describe("GET tickets/:id", () => {

        const ticketId = 'dummy-ticket-id';

        let getByIdMock;

        beforeEach(() => {
            getByIdMock = jest.spyOn(Ticket, 'getById');
        });

        it('Should return 200 when searching with an existing id', () => {
            getByIdMock.mockImplementation(async (ticketId) => Promise.resolve(tickets[0]));

            return request(app).get(`${BASE_PATH}/tickets/${ticketId}`)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT)
                .then((response) => {
                    expect(response.status).toBe(200);
                    expect(response.body.content.text).toBe(ticket.text);
                    expect(getByIdMock).toBeCalledWith(ticketId);
                });
        });

        it('Should return 404 when searching with an unexisting id', () => {
            const wrongId = 'dummy-wrong-id';
            getByIdMock.mockImplementation(async (wrongId) => Promise.resolve(null));

            return request(app).get(`${BASEPATH}/tickets/${wrongId}`)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT)
                .then((response) => {
                    expect(response.status).toBe(404);
                    expect(getByIdMock).toBeCalledWith(wrongId);
                });
        });
    });
});