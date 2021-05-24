//const app = require("../server");
const db = require("../database/models");

//const supertest = require("supertest");

//const request = supertest(app)

describe('Activity model', () => {

  beforeAll(async () => {
    await db.sequelize.authenticate();
    await db.sequelize.sync({ force: true })
  })

  it("should create a new model", async () => {
    const mariachi = await db.Activity.create({
      name: "Mariachi",
      difficulty: 1,
      duration: 90,
      season: "summer",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    expect(mariachi.name).toEqual("Mariachi");
  });

  it("should update the model", async () => {
    const modelData = {
      name: "Tequila Express",
      difficulty: 1,
      duration: 540,
      season: "summer",
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const tequilaExpress = await db.Activity.create(modelData);
    tequilaExpress.difficulty = 5;
    await tequilaExpress.save();

    expect(tequilaExpress.difficulty).toEqual(5);

  })

  afterAll(async () => {
    await db.sequelize.close()
  })


})


