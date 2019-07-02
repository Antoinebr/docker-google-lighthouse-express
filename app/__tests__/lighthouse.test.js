//routes.test.js
const request = require('supertest');

let app;

/**
 * beforeAll 
 * 
 * Runs before running all the tests
 */
beforeAll(() => {

    app = require('../app');

    process.env.PORT = 4300;
    process.env.REPORTS_PATH = "/Users/abrossault/Documents/code/playground/docker-LightHouse/docker-google-lighthouse-express/report/";


    // let's run the server 
    app.set('port', process.env.PORT);

    const server = app.listen(app.get('port'), () => {
        console.log(`Express running → PORT ${server.address().port}`);
    });

});


/**
 * afterAll 
 * 
 * Runs after running all the tests
 */
afterAll(() => {

    console.log('server closed!');
});


describe('Test the LightHouse endpoints', () => {

    beforeEach(() => {
        jest.setTimeout(200000);
    });


    it('should return a test result', async () => {

        await request(app)
        .post('/runOriginalTest')
        .send({url: 'https://google.com/'})
        .expect(200);

    });


    it('should return a test result even with a slow page', async () => {

        await request(app)
        .post('/runOriginalTest')
        .send({url: 'https://www.landrover.ie/range-rover-velar'})
        .expect(200);

    });


    it('should send an error with a 500 status when we hit a 404', async () => {

        await request(app)
        .post('/runOriginalTest')
        .send({url: 'https://googdkk993ddssZle.com/'})
        .expect(500);

    });



    it('should run a test and block requests', async () => {

        await request(app)
        .post('/runtest')
        .send({
            url: "https://monbraceletnato.fr/",
            blockedRequests: ["zopim.com","google-analytics.com","facebook.net"]
        })
        .expect(200);

    });



    it("should send an error with a 500 status when we hit a 404", async () => {

        await request(app)
        .post('/runtest')
        .send({
            url: "https://monbracelfddffddffdfdddfdfetnato.fr/",
            blockedRequests: ["zopim.com","google-analytics.com","facebook.net"]
        })
        .expect(500);

    });


    it("should continueto run even after a LightHouse error", async () => {

        await request(app)
        .post('/runtest')
        .send({url: "https://www.sportscheck.com/jacken/damen/"})
        .expect(500);
    });

    it("Should work after a timeout", async () => {
    
        await request(app)
        .post('/runtest')
        .send({url: 'https://google.com/'})
        .expect(200);

    });


    it("should return a timeout during precheck", async () => {

        const body = await request(app)
        .post('/runtest')
        .send({url: "https://www.sportscheck.com/jacken/damen/"})
        .expect(500)
        

    });

});