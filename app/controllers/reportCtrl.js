
const fs = require('fs');


exports.getReport = (req,res) => {

    try {

        const html = fs.readFileSync(`${process.env.REPORTS_PATH}${req.query.report}`);

        res.send(html.toString());

    } catch (error) {

        return res.status(404).json({
            error: "Nothing found"
        });

    }
}