
const fs = require('fs');


exports.getReport = (req,res) => {

    try {

        const html = fs.readFileSync(`/home/chrome/reports/${req.query.report}`);

        res.send(html.toString());

    } catch (error) {

        return res.status(404).json({
            error: "Nothing found"
        });

    }
}