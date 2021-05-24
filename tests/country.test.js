
const app = require("../server");
const db = require("../database/models");

const supertest = require("supertest");

const request = supertest(app)

describe("The most basic test", () => {

  beforeAll(() => db.sequelize.authenticate()
    .then(res => console.log("/// CONNECTED TO DATABASE OK!///"))
    .catch(error => {
      console.log("Cant connect to the database!", error)
    })
  );

  it('should fetch the first 10 countries', async () => {
    const res = await request.get('/countries');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('results');
    expect(res.body.results.rows).toHaveLength(10);
  });

  it("should respond with the country that matches the code", async () => {
    const code = 'CAN';
    const res = await request.get(`/countries/${code}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.code).toBe('CAN');
  });

  it("should respond with 404 if the country code is not found", async () => {
    const code = 'XXX';
    const res = await request.get(`/countries/${code}`);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Country not found!');
  });

  it("should respond with the countries that match the name pattern", async () => {
    const name = 'bra';
    const res = await request.get(`/countries?name=${name}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('results');
    expect(res.body.results.rows).toHaveLength(2);
  })

  it("should respond with the country that matches the name", async () => {
    const name = 'Canada';
    const res = await request.get(`/countries?name=${name}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('results');
    expect(res.body.results.rows).toHaveLength(1);
    expect(res.body.results.rows[0].name).toBe('Canada');

  })

  it("should return the countries that match the name and continent filters", async () => {
    const name = "bra";
    const continent = "Americas";
    const res = await request.get(`/countries?name=${name}&continent=${continent}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.rows).toHaveLength(1);
    expect(res.body.results.rows[0].name).toBe('Brazil');
  })

  it("should return the countries in alphabetical order", async () => {
    const name = "bra";
    const order = "nameUp";
    const res = await request.get(`/countries?name=${name}&order=${order}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.rows).toHaveLength(2);
    expect(res.body.results.rows[0].name).toBe('Brazil');
  })

  it("should return the countries in reverse alphabetical order", async () => {
    const name = "bra";
    const order = "nameDown";
    const res = await request.get(`/countries?name=${name}&order=${order}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.rows).toHaveLength(2);
    expect(res.body.results.rows[1].name).toBe('Brazil');
  })

  it("should return the countries sorted by most populated", async () => {
    const name = "bra";
    const order = "popDown";
    const res = await request.get(`/countries?name=${name}&order=${order}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.rows).toHaveLength(2);
    expect(res.body.results.rows[0].name).toBe('Brazil');
  })

  it("should return the countries sorted by least populated", async () => {
    const name = "bra";
    const order = "popUp";
    const res = await request.get(`/countries?name=${name}&order=${order}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.rows).toHaveLength(2);
    expect(res.body.results.rows[1].name).toBe('Brazil');
  })


  afterAll(async () => {
    await db.sequelize.close()
  })


})