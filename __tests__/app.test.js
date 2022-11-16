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
        res.body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            review_id: expect.any(Number),
            comment_count: expect.any(String),
          });
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

  test("GET - 404 returns a 'path not found' error when invalid path", () => {
    return request(app)
      .get("/api/invalid-review-path")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("path not found!");
      });
  });
});

describe("GET /api/reviews/:review_id", () => {
  test("GET - 200: responds with an object of review information", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then((res) => {
        expect(typeof res.body).toBe("object");
        expect(res.body.review).toMatchObject({
          review_id: 2,
          title: expect.any(String),
          designer: expect.any(String),
          owner: expect.any(String),
          review_img_url: expect.any(String),
          review_body: expect.any(String),
          category: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
  test("GET - 400: invalid ID", () => {
    return request(app)
      .get("/api/reviews/nonsense")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request!");
      });
  });
  test("GET - 404: non existent ID", () => {
    return request(app)
      .get("/api/reviews/999")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("path not found!");
      });
  });
});
