const reportDb = [
    {
        id: '1',
        userId: '1',
        messageId: '1',
        text: 'This message contains hate',
        date: Date.now(),
        status: 'SENT'
    },
    {
        id: '2',
        userId: '2',
        messageId: '2',
        text: 'This message contains hate',
        date: Date.now(),
        status: 'SENT'
    }
];

export const getAllReports = (req, res, next) => {
    res.send(reportDb);
};

export const getReportById = (req, res, next) => {
    const id = req.params.id;
    const report = reportDb.find(r => { return r.id === id; });
    if (report){
        res.send(report);
    } else {
        res.sendStatus(404);
    }
};

export const createReport = (req, res, next) => {
    const report = req.body;
    reportDb.push(report);
    res.sendStatus(201);
};

export const updateReport = (req, res, next) => {
    const id = req.params.id;
    const report = reportDb.find(r => { return r.id === id });
    if (report) {
        const reportUpdate = req.body;
        const index = reportDb.indexOf(report)
        reportDb[index].text = reportUpdate.text;
        res.send(reportDb[index]);
    } else {
        res.sendStatus(404);
    }
};

export const deleteReport = (req, res, next) => {
    const id = req.params.id;
    const report = reportDb.find(r => { return r.id === id });
    if (report) {
        const index = reportDb.indexOf(report);
        reportDb.splice(index, 1);
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
};
