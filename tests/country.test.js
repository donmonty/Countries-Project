
const app = require("../server");
const db = require("../database/models");

const supertest = require("supertest");

const request = supertest(app)

describe("Countries endpoint", () => {

  beforeAll(async () => {
    await db.sequelize.authenticate();
    await db.sequelize.sync({ force: true })
    
    const brazil = await db.Country.create({
      name: "Brazil",
      continent: "Americas",
      code: "BRA",
      capital: "Brasilia",
      subregion: "Americas",
      area: 8515767,
      population: 206135893,
      flag: "https://restcountries.eu/data/bra.svg",
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const gibraltar = await db.Country.create({
      name: "Gibraltar",
      continent: "Europe",
      code: "GIB",
      capital: "Gibraltar",
      subregion: "Europe",
      area: 6,
      population: 33140,
      flag: "https://restcountries.eu/data/gib.svg",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
  })

  it('should fetch the first 2 countries', async () => {
    const res = await request.get('/countries');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('results');
    expect(res.body.results.rows).toHaveLength(2);
  });

  it("should respond with the country that matches the code", async () => {
    const code = 'BRA';
    const res = await request.get(`/countries/${code}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.code).toBe('BRA');
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
    const name = 'Brazil';
    const res = await request.get(`/countries?name=${name}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('results');
    expect(res.body.results.rows).toHaveLength(1);
    expect(res.body.results.rows[0].name).toBe('Brazil');

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