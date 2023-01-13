const app = require('../app');
const request = require('supertest');
const Ticket = require('../models/Ticket');
const Song = require('../services/songs')
const jwt = require('../auth/jwt');

const tickets = [{
    "_id": "63b3318a3da97aba71958c75",
    "authorId": "63acaac92087cbc870cb4dc7",
    "title": "First ticket of the year",
    "text": "This ticket is the first of 2023",
    "status": "sent",
    "priority": "low",
    "createDate": new Date('January 1, 2023 00:00:00')
}, {
    "_id": "63b3318a3da97aba71958s98",
    "authorId": "63acaac92087cbc870cb4dc7",
    "title": "Second ticket",
    "text": "Now we have two tickets",
    "status": "rejected",
    "priority": "medium",
    "createDate": new Date('January 2, 2023 14:32:25')
}
];

const TICKET_ENDPOINT = "/support/v1/tickets/"

const USER_TOKEN_JWT = jwt.generateToken({ id: '63acaac92087cbc870cb4dc7', role: 'user' });
const BAD_USER_TOKEN_JWT = jwt.generateToken({ id: '29acaac92087cbc235hn2jr0', role: 'user' });
const ADMIN_TOKEN_JWT = jwt.generateToken({ id: '63aee4412087cbc870cb4dfb', role: 'admin' });


describe("Tickets API", () => {

    describe("GET /tickets", () => {
        let findAllTicketsMock;
        beforeEach(() => {
            findAllTicketsMock = jest.spyOn(Ticket, 'find');
        });

        it("Should return all tickets", async () => {
            findAllTicketsMock.mockImplementation(async () => Promise.resolve(tickets));

            return request(app).get(TICKET_ENDPOINT)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT
                ).then((response) => {
                    expect(response.statusCode).toBe(200);
                    expect(response.body.content).toBeArrayOfSize(2);
                    expect(findAllTicketsMock).toBeCalled();
                });
        });

        it("Should return internal server error", () => {
            findAllTicketsMock.mockImplementation(async () => Promise.reject("Internal server error"));

            return request(app).get(TICKET_ENDPOINT)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT
                ).then((response) => {
                    expect(response.statusCode).toBe(500);
                    expect(findAllTicketsMock).toBeCalled();
                });
        });
    });

    describe("GET /tickets/user/:id", () => {
        let findTicketByUserIdMock;
        beforeEach(() => {
            findTicketByUserIdMock = jest.spyOn(Ticket, 'find');
        });

        it('Should return Unauthorized when user/admin try to read all tickets from another user', () => {
            const authorId = tickets[0].authorId;

            return request(app).get(TICKET_ENDPOINT + "user/" + authorId)
                .set("Authorization",
                    "Bearer " + BAD_USER_TOKEN_JWT)
                .then((response) => {
                    expect(response.status).toBe(401);
                });
        });

        it('Should return OK when AUTHOR search his/her own tickets', () => {
            const authorId = tickets[0].authorId;
            findTicketByUserIdMock.mockImplementation(async () => Promise.resolve(tickets));

            return request(app).get(TICKET_ENDPOINT + "user/" + authorId)
                .set(
                    "Authorization",
                    "Bearer " + USER_TOKEN_JWT
                ).then((response) => {
                    expect(response.status).toBe(200);
                    expect(findTicketByUserIdMock).toBeCalled();
                });
        });

        it("Should return internal server error", () => {
            const authorId = tickets[0].authorId;
            findTicketByUserIdMock.mockImplementation(async () => Promise.reject("Internal server error"));

            return request(app).get(TICKET_ENDPOINT + "user/" + authorId)
                .set(
                    "Authorization",
                    "Bearer " + USER_TOKEN_JWT
                ).then((response) => {
                    expect(response.status).toBe(500);
                    expect(findTicketByUserIdMock).toBeCalled();
                });
        });
    });

    describe("GET /tickets/:id", () => {
        let findTicketByIdMock;
        beforeEach(() => {
            findTicketByIdMock = jest.spyOn(Ticket, 'getById');
        });

        it('Should return Unauthorized when user try to read a ticket from another user', () => {
            const ticketId = tickets[0]._id;
            findTicketByIdMock.mockImplementation(async (ticketId) => Promise.resolve(tickets[0]));

            return request(app).get(TICKET_ENDPOINT + ticketId)
                .set("Authorization",
                    "Bearer " + BAD_USER_TOKEN_JWT
                ).then((response) => {
                    expect(response.status).toBe(401);
                    expect(findTicketByIdMock).toBeCalled();
                });
        });

        it('Should return OK when ADMIN searching with an existing id', () => {
            const ticketId = tickets[0]._id;
            findTicketByIdMock.mockImplementation(async (ticketId) => Promise.resolve(tickets[0]));

            return request(app).get(TICKET_ENDPOINT + ticketId)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT
                ).then((response) => {
                    expect(response.status).toBe(200);
                    expect(response.body.content.authorId).toBe(tickets[0].authorId);
                    expect(findTicketByIdMock).toBeCalled();
                });
        });

        it('Should return OK when USER searching with an existing id', async () => {
            const ticketId = tickets[0]._id;
            findTicketByIdMock.mockImplementation(async (ticketId) => Promise.resolve(tickets[0]));

            return request(app).get(TICKET_ENDPOINT + ticketId)
                .set(
                    "Authorization",
                    "Bearer " + USER_TOKEN_JWT
                ).then((response) => {
                    expect(response.status).toBe(200);
                    expect(response.body.content.authorId).toBe(tickets[0].authorId);
                    expect(findTicketByIdMock).toBeCalledWith(ticketId);
                });
        });

        it('Should return NOT_FOUND when searching with a non existing id', () => {
            const ticketId = "10b4456a2da87aba71958c00";
            findTicketByIdMock.mockImplementation(async (ticketId) => Promise.resolve(null));

            return request(app).get(TICKET_ENDPOINT + ticketId)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT
                )
                .then((response) => {
                    expect(response.status).toBe(404);
                    expect(findTicketByIdMock).toBeCalledWith(ticketId);
                });
        });

        it('Should return Internal Server Error when the request is invalid', () => {
            const ticketInvalidId = "invalidId";
            findTicketByIdMock.mockImplementation(async (ticketInvalidId) => Promise.reject(500));

            return request(app).get(TICKET_ENDPOINT + ticketInvalidId)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT
                )
                .then((response) => {
                    expect(response.status).toBe(500);
                    expect(findTicketByIdMock).toBeCalledWith(ticketInvalidId);
                });
        });
    });

    describe("Post /tickets", () => {
        var saveTicketMock;
        beforeEach(() => {
            saveTicketMock = jest.spyOn(Ticket, "insert");
        });

        it("Should return 401 if user is not authenticate", () => {

            return request(app).post(TICKET_ENDPOINT)
                .send(tickets[0])
                .then((response) => {
                    expect(response.statusCode).toBe(401);
                });
        });

        it("Should add a new ticket if everything is fine", () => {
            saveTicketMock.mockImplementation(async () => Promise.resolve(true));

            return request(app).post(TICKET_ENDPOINT)
                .set(
                    "Authorization",
                    "Bearer " + USER_TOKEN_JWT
                )
                .send(tickets[0])
                .then((response) => {
                    expect(response.statusCode).toBe(201);
                    expect(saveTicketMock).toBeCalled();
                });
        });

        it("Should return 400 if there is a validate problem", () => {
            invalidPriority = "invalidPriority";
            saveTicketMock.mockImplementation(async () => Promise.reject({ errors: 'BSONTypeError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer' }));

            return request(app).post(TICKET_ENDPOINT)
                .set(
                    "Authorization",
                    "Bearer " + USER_TOKEN_JWT
                ).send({
                    authorId: "63acaac92087cbc870cb4dc7",
                    title: "Wrong URL",
                    text: "This song has a wrong link",
                    priority: invalidPriority
                }).then((response) => {
                    expect(response.statusCode).toBe(400);
                    expect(saveTicketMock).toBeCalled();
                });
        });

        it("Should return 500 if there is a problem with the conection", () => {
            saveTicketMock.mockImplementation(async () => Promise.reject("Internal server error"));

            return request(app).post(TICKET_ENDPOINT)
                .send({
                    authorId: "63acaac92087cbc870cb4dc7",
                    title: "Wrong URL",
                    text: "This song has a wrong link",
                    priority: "low"
                }).set(
                    "Authorization",
                    "Bearer " + USER_TOKEN_JWT
                ).then((response) => {
                    expect(response.statusCode).toBe(500);
                    expect(saveTicketMock).toBeCalled();
                });
        });
    });

    describe("Delete /tickets/:id", () => {
        var deleteTicketByIdMock;
        beforeEach(() => {
            deleteTicketByIdMock = jest.spyOn(Ticket, "findByIdAndDelete");
        });

        it("Should return 401 if user is not authenticate", () => {
            const ticketId = tickets[0]._id;

            return request(app).delete(TICKET_ENDPOINT + ticketId)
                .then((response) => {
                    expect(response.statusCode).toBe(401);
                });
        });

        it("Should return 401 if user is authenticate", () => {
            const ticketId = tickets[0]._id;

            return request(app).delete(TICKET_ENDPOINT + ticketId)
                .set(
                    "Authorization",
                    "Bearer " + USER_TOKEN_JWT
                )
                .then((response) => {
                    expect(response.statusCode).toBe(401);
                });
        });

        it("Should return Not Content if ADMIN is authenticate and the ticket is deleted", () => {
            const ticketId = tickets[0]._id;
            deleteTicketByIdMock.mockImplementation(async (ticketId) => Promise.resolve(true));

            return request(app).delete(TICKET_ENDPOINT + ticketId)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT
                ).then((response) => {
                    expect(response.statusCode).toBe(204);
                    expect(deleteTicketByIdMock).toBeCalledWith(ticketId);
                });
        });
    });

    describe("Update /tickets/:id", () => {
        var updateTicketByIdMock;
        let findTicketByIdMock;
        let changeUrlMock;
        beforeEach(() => {
            updateTicketByIdMock = jest.spyOn(Ticket.prototype, "updateTicket");
            findTicketByIdMock = jest.spyOn(Ticket, 'getById');
            changeUrlMock = jest.spyOn(Song, 'changeUrl');
        });

        var newTicket = new Ticket({
            "_id": "63b3318a3da97aba71958d45",
            "authorId": "63acaac92087cbc870cb4dc7",
            "songId": "507f1f77bcf86cd799439011",
            "title": "New ticket",
            "text": "This is a new ticket",
            "status": "sent",
            "priority": "low",
            "createDate": new Date('January 1, 2023 00:00:00')
        })

        var newTicketRejected = new Ticket({
            "_id": "63b3318a3da97aba71958d45",
            "authorId": "63acaac92087cbc870cb4dc7",
            "songId": "507f1f77bcf86cd799439011",
            "reviewerId": "63aee4412087cbc870cb4dfb",
            "title": "New ticket",
            "text": "This is a new ticket",
            "status": "rejected",
            "priority": "low",
            "createDate": new Date('January 1, 2023 00:00:00'),
            "updateDate": new Date('January 2, 2023 00:00:00')
        })

        var newTicketValidated = new Ticket({
            "_id": "63b3318a3da97aba71958d45",
            "authorId": "63acaac92087cbc870cb4dc7",
            "songId": "507f1f77bcf86cd799439011",
            "reviewerId": "63aee4412087cbc870cb4dfb",
            "title": "New ticket",
            "text": "This is a new ticket",
            "status": "validated",
            "priority": "low",
            "createDate": new Date('January 1, 2023 00:00:00'),
            "updateDate": new Date('January 2, 2023 00:00:00')
        })

        it("Should return 401 if user is not authenticate", () => {
            const ticketId = newTicket._id.toString();

            return request(app).patch(TICKET_ENDPOINT + ticketId)
                .then((response) => {
                    expect(response.statusCode).toBe(401);
                });
        });

        it("Should return 401 if user is authenticate", () => {
            const ticketId = newTicket._id.toString();

            return request(app).patch(TICKET_ENDPOINT + ticketId)
                .set(
                    "Authorization",
                    "Bearer " + USER_TOKEN_JWT
                )
                .then((response) => {
                    expect(response.statusCode).toBe(401);
                });
        });

        it('Should return NOT_FOUND when searching with a non existing id', () => {
            const ticketId = "invalidId";
            findTicketByIdMock.mockImplementation(async (ticketId) => Promise.resolve(null));

            return request(app).patch(TICKET_ENDPOINT + ticketId)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT
                ).send({
                    reviewerId: "63aee4412087cbc870cb4dfb",
                    status: "rejected",
                    priority: "low"
                })
                .then((response) => {
                    expect(response.status).toBe(404);
                    expect(findTicketByIdMock).toBeCalledWith(ticketId);
                });
        });

        it('Should return no content when ticket updates correctly', () => {
            const ticketId = newTicket._id.toString();
            findTicketByIdMock.mockImplementation(async (ticketId) => Promise.resolve(newTicket));
            updateTicketByIdMock.mockImplementation(async (reviewerId, status, priority) => Promise.resolve(newTicketRejected));

            return request(app).patch(TICKET_ENDPOINT + ticketId)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT
                ).send({
                    reviewerId: "63aee4412087cbc870cb4dfb",
                    status: "rejected",
                    priority: "medium"
                })
                .then((response) => {
                    expect(response.status).toBe(204);
                    expect(findTicketByIdMock).toBeCalledWith(ticketId);
                });
        });

        it('Should return validation error when wrong parameters are passed to update', () => {
            const ticketId = newTicket._id.toString();
            findTicketByIdMock.mockImplementation(async (ticketId) => Promise.resolve(newTicket));
            updateTicketByIdMock.mockImplementation(async (reviewerId, status, priority) => Promise.reject({errors: 'validation error'}));

            return request(app).patch(TICKET_ENDPOINT + ticketId)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT
                ).send({
                    reviewerId: "63aee4412087cbc870cb4dfb",
                    status: "wrongStatus",
                    priority: "medium"
                })
                .then((response) => {
                    expect(response.status).toBe(400);
                    expect(findTicketByIdMock).toBeCalledWith(ticketId);
                });
        });

        it("Should return internal server error", () => {
            const ticketId = newTicket._id.toString();
            findTicketByIdMock.mockImplementation(async (ticketId) => Promise.resolve(newTicket));
            updateTicketByIdMock.mockImplementation(async (reviewerId, status, priority) => Promise.reject('Internal server error'));

            return request(app).patch(TICKET_ENDPOINT + ticketId)
                .set(
                    "Authorization",
                    "Bearer " + ADMIN_TOKEN_JWT
                ).send({
                    reviewerId: "63aee4412087cbc870cb4dfb",
                    status: "rejected",
                    priority: "medium"
                }).then((response) => {
                    expect(response.statusCode).toBe(500);
                });
        });
    });
});