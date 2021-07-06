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

  it("should not create a new model if a required filed is missing", async () => {
    try {
      const pyramids = await db.Activity.create({
        name: null,
        difficulty: 1,
        duration: 90,
        season: "winter",
        createdAt: new Date(),
        updatedAt: new Date()
      })
    } catch (error) {
      //console.log("/////////////////////////////// Error", error.errors[0].type)
      expect(error.errors[0].type).toEqual("notNull Violation");
    }
  })

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


