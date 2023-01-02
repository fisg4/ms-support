const Report = require('../../models/report');
const dbConnect = require('../../db');

jest.setTimeout(30000);

describe("Reports DB connection", () => {
    beforeAll((done) => {
        if (dbConnect.readyState == 1) {
            done();
        } else {
            dbConnect.on("connected", () => done());
        }
    });

    beforeEach(async () => {
        await Report.deleteMany({});
    });

    it("Create a report in the DB", async () => {
        const report = new Report({
            "authorId": "637d0c328a43d958f6ff662b",
            "messageId": "6397819481f989ded88dc693",
            "title": "The message contains ofensive language",
            "text": "This message contains hate and bad words",
            "createDate": Date.now()
        });
        await report.save();
        reports = await Report.find();
        expect(reports).toBeArrayOfSize(1);
    });

    afterAll(async () => {
        if (dbConnect.readyState == 1) {
            await dbConnect.dropDatabase();
            await dbConnect.close();
        }
    });
});