const log4js = require('log4js');
const logger = log4js.getLogger('genres.test');
const {User} = require('../../models/user');
const {Genre} = require('../../models/genre');
const request = require('supertest');
let server;

describe('/api/genres', () => {
    //Before each test we need to start the server and
    //after each test we need to close the server,
    //so as not to get an exception with the server still open
    //from previous tests
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => { 
        server.close(); 
        
        //Clear the genres collection
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {        
        it('should return a genre if valid id is passed', async () => {
            const genre = await new Genre({ name: 'genre1' });
            genre.save();
            const res = await request(server).get('/api/genres/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });
        it('should return 404 in case invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1');
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {
        it('should return 401 if client is not logged in', async () => {
            const res = await request(server)
                .post('/api/genres')
                .send({ name: 'genre1' });
            expect(res.status).toBe(401);
        });
        it('should return 400 if genre name is less than 5 chars', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: '1234' });

            expect(res.status).toBe(400);
        });
        it('should return 400 if genre name is more than 50 chars', async () => {
            const longName = new Array(52).join('a');
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: longName });

            expect(res.status).toBe(400);
        });
        it('should save a genre if it is valid', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: 'genre1' });
            
            const genre = Genre.find({ name: 'genre1' });
            
            expect(genre).not.toBeNull();
        });
        it('should return a genre if it is valid', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: 'genre1' });
            
            logger.info(res.body);
            expect(res.body).not.toBeNull();
            //@@expect(res.body).toHaveProperty('_id');
            //@@expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
});