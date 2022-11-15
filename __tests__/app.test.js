const seed = require("../db/seeds/seed");
const request = require("supertest");
const db = require("../db/connection");
const app = require("../app");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("categories", () => {
  test("GET - 200 returns an array of categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        console.log(res.body.categories, "res.body");
        expect(res.body.categories.length).toBe(4);
        expect(Array.isArray(res.body.categories)).toBe(true);
        expect(res.body.categories[0]).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        });
      });
  });
});
