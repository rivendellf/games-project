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

describe("GET /api/categories", () => {
  test("GET - 200 returns an array of categories", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        expect(res.body.categories.length).toBe(4);
        expect(Array.isArray(res.body.categories)).toBe(true);
        expect(res.body.categories[0]).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        });
      });
  });
  test("GET - 404 returns a 'path not found' error when invalid path", () => {
    return request(app)
      .get("/api/invalid-path")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("path not found!");
      });
  });
});

describe("GET /api/reviews", () => {
  test("GET - 200 returns an array of reviews, with all expected properties", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews.length).toBe(13);
        expect(Array.isArray(res.body.reviews)).toBe(true);
        expect(res.body.reviews[0]).toMatchObject({
          title: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_img_url: expect.any(String),
          review_body: expect.any(String),
          category: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          review_id: expect.any(Number),
          comment_count: expect.any(String),
        });
      });
  });

  test("GET - 200 default sort order should be by date, descending", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        expect(res.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  test("GET - 400 returns a 'path not found' error when invalid path", () => {
    return request(app)
      .get("/api/invalid-review-path")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("path not found!");
      });
  });
});
