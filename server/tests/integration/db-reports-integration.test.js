const Report = require('../../models/report');
const dbConnect = require('../../db');
const Ticket = require('../../models/ticket');

jest.setTimeout(30000);

describe("Report and tickets functions integrated with mongodb", () => {

    beforeAll((done) => {
        if (dbConnect.readyState == 1) {
            done();
        } else {
            dbConnect.on("connected", () => done());
        }
    });

    beforeEach(async () => {
        await Report.deleteMany({});
        await Ticket.deleteMany({});
    });

    it("Create a report in the DB", async () => {
        const report = await Report.createReport("637d0c328a43d958f6ff662b", "6397819481f989ded88dc693", "The message contains ofensive language", "This message contains hate and bad words");
        expect(report).toHaveProperty("_id");
        const reports = await Report.find();
        expect(reports).toBeArrayOfSize(1);
    });

    it("Should getById a report correctly", async () => {
        const report = await Report.createReport("637d0c328a43d958f6ff662b", "6397819481f989ded88dc693", "The message contains ofensive language", "This message contains hate and bad words");
        const reportFound = await Report.findById(report._id);
        expect(reportFound.authorId.toString()).toBe(report.authorId.toString());
        expect(reportFound.messageId.toString()).toBe(report.messageId.toString());
    });

    it("Should update report correctly", async () => {
        const report = await Report.createReport("637d0c328a43d958f6ff662b", "6397819481f989ded88dc693", "The message contains ofensive language", "This message contains hate and bad words");
        const reviwerId = "637d0c328a43d958f3ff662b";
        const status = "rejected";
        const updateReport = await report.updateReport(reviwerId, status);
        expect(updateReport.reviewerId.toString()).toBe(reviwerId.toString());
        expect(updateReport.status).toBe(status);
    });

    it("Should rollback update report correctly", async () => {
        const report = await Report.createReport("637d0c328a43d958f6ff662b", "6397819481f989ded88dc693", "The message contains ofensive language", "This message contains hate and bad words");
        const reviwerId = "637d0c328a43d958f6ff663b";
        const status = "rejected";
        const updateReport = await report.updateReport(reviwerId, status);
        const rollbackUpdateReport = await updateReport.rollbackUpdateReport(null, "sent");
        expect(rollbackUpdateReport.reviewerId).toBeNull();
        expect(rollbackUpdateReport.status).toBe("sent");
    });

    it("Should delete a report correctly", async () => {
        const report = await Report.createReport("637d0c328a43d958f6ff662b", "6397819481f989ded88dc693", "The message contains ofensive language", "This message contains hate and bad words");
        await Report.findByIdAndDelete(report._id);
        const reports = await Report.find();
        expect(reports).toBeArrayOfSize(0);
    });

    it("Create a ticket in the DB", async () => {
        const ticket = await Ticket.insert("637d0c328a43d958f6ff662b", "6397819481f989ded88dc693", "Invalid URL", "https://www.youtube.com/watch?v=ZxwUkc_DzYY&list=RDZxwUkc_DzYY&start_radio=1");
        expect(ticket).toHaveProperty("_id");
        const tickets = await Ticket.find();
        expect(tickets).toBeArrayOfSize(1);
    });

    it("Should getById a ticket correctly", async () => {
        const ticket = await Ticket.insert("637d0c328a43d958f6ff662b", "6397819481f989ded88dc693", "Invalid URL", "https://www.youtube.com/watch?v=ZxwUkc_DzYY&list=RDZxwUkc_DzYY&start_radio=1");
        const ticketFound = await Ticket.getById(ticket._id);
        expect(ticketFound.authorId.toString()).toBe(ticket.authorId.toString());
        expect(ticketFound.songId.toString()).toBe(ticket.songId.toString());
    });

    it("Should getAllTickets correctly", async () => {
        const ticket1 = await Ticket.insert("637d0c328a43d958f6ff662b", "6397819481f989ded88dc693", "Invalid URL", "https://www.youtube.com/watch?v=ZxwUkc_DzYY&list=RDZxwUkc_DzYY&start_radio=1");
        const ticket2 = await Ticket.insert("637d0c328a43d958f6ff643b", "7897819481f989ded88dc693", "Invalid URL", "https://www.youtube.com/watch?v=WpYeekQkAdc");
        const ticketsFound = await Ticket.getAll();
        expect(ticketsFound[0].authorId.toString()).toBe(ticket1.authorId.toString());
        expect(ticketsFound[1].authorId.toString()).toBe(ticket2.authorId.toString());
        expect(ticketsFound).toBeArrayOfSize(2);
    });

    it("Should getUsertickets correctly", async () => {
        const ticket1 = await Ticket.insert("637d0c328a43d958f6ff662b", "6397819481f989ded88dc693", "Invalid URL", "https://www.youtube.com/watch?v=ZxwUkc_DzYY&list=RDZxwUkc_DzYY&start_radio=1");
        const ticket2 = await Ticket.insert("637d0c328a43d958f6ff643b", "7897819481f989ded88dc693", "Invalid URL", "https://www.youtube.com/watch?v=WpYeekQkAdc");
        const userTickets = await Ticket.getUserTickets("637d0c328a43d958f6ff662b");
        expect(userTickets[0].authorId.toString()).toBe(ticket1.authorId.toString());
        expect(userTickets).toEqual(expect.not.stringContaining(ticket2._id.toString()))
        expect(userTickets).toBeArrayOfSize(1);
    });


    it("Should update ticket correctly", async () => {
        const ticket = await Ticket.insert("637d0c328a43d958f6ff662b", "6397819481f989ded88dc693", "The message contains ofensive language", "This message contains hate and bad words");
        const reviwerId = "637d0c328a43d958f3ff662b";
        const status = "rejected";
        const priority = "high";
        const updateTicket = await ticket.updateTicket(reviwerId, status, priority);
        expect(updateTicket.reviewerId.toString()).toBe(reviwerId.toString());
        expect(updateTicket.status).toBe(status);
        expect(updateTicket.priority).toBe(priority);
    });

    it("Should rollback update ticket correctly", async () => {
        const ticket = await Ticket.insert("637d0c328a43d958f6ff662b", "6397819481f989ded88dc693", "The message contains ofensive language", "This message contains hate and bad words");
        const reviwerId = "637d0c328a43d958f6ff663b";
        const status = "validated";
        const priority = "medium";
        await ticket.updateTicket(reviwerId, status, priority);
        const rollbackUpdateTicket = await ticket.rollbackUpdate("sent", "low");
        expect(rollbackUpdateTicket.reviewerId).toBeNull();
        expect(rollbackUpdateTicket.status).toBe("sent");
        expect(rollbackUpdateTicket.priority).toBe("low");
    });

    it("Should delete a ticket correctly", async () => {
        const ticket = await Ticket.insert("637d0c328a43d958f6ff662b", "6397819481f989ded88dc693", "The message contains ofensive language", "This message contains hate and bad words");
        await Ticket.findByIdAndDelete(ticket._id);
        const tickets = await Ticket.find();
        expect(tickets).toBeArrayOfSize(0);
    });

    afterAll(async () => {
        if (dbConnect.readyState == 1) {
            await dbConnect.dropDatabase();
            await dbConnect.close();
        }
    });
});