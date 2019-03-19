const fs = require('fs');
const fg = require('fast-glob');


exports.getReport = (req, res) => {

    try {

        const html = fs.readFileSync(`${process.env.REPORTS_PATH}${req.query.report}`);

        res.send(html.toString());

    } catch (error) {

        return res.status(404).json({
            error: "Nothing found"
        });

    }
}


exports.getAllReports = async (req, res) => {

    try {

        let entries = await fg([`${process.env.REPORTS_PATH}*`]);

        entries = entries.map( e => e.replace(process.env.REPORTS_PATH,''));

        res.json(entries)


    } catch ( e ) {

        return res.status(500).json({
            error: e.toString()
        });
    }
    

}