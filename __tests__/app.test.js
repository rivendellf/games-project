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

describe("GET /api/reviews/:review_id/comments", () => {
  test("GET - 200: responds with an array of comments", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comment).toBeSortedBy("created_at", {
          ascending: true,
        });
        expect(res.body.comment).toHaveLength(3);
        res.body.comment.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 2,
          });
        });
      });
  });

  test("GET - 400: invalid ID returns bad request", () => {
    return request(app)
      .get("/api/reviews/nonsense/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request!");
      });
  });
  test("GET - 404: non-existent review_id", () => {
    return request(app)
      .get("/api/reviews/999/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("review ID not found!");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("POST - 201: returns the new comment", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({ username: "philippaclaire9", comment: "what a lovely game!" })
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toMatchObject({
          body: "what a lovely game!",
          author: "philippaclaire9",
          votes: 0,
          review_id: 2,
          created_at: expect.any(String),
          comment_id: expect.any(Number),
        });
      });
  });
  test("POST - 400: invalid review ID returns bad request", () => {
    return request(app)
      .post("/api/reviews/nonsense/comments")
      .send({ username: "philippaclaire9", comment: "what a lovely game!" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request!");
      });
  });
  test("POST - 400: missing username or body returns bad request", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({ username: "philippaclaire9" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request!");
      });
  });
  test("POST - 404: username doesn't exist", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .send({ username: "aisha", comment: "what a lovely game!" })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("resource not found!");
      });
  });
  test("POST - 404: non-existent review_id", () => {
    return request(app)
      .post("/api/reviews/999/comments")
      .send({ username: "philippaclaire9", comment: "what a lovely game!" })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("resource not found!");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("PATCH - 200 should return updated review with increased votes", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: 10 })
      .expect(200)
      .then((res) => {
        expect(res.body.review.votes).toBe(15);
      });
  });
  test("PATCH - 200 should return updated review with decreased votes", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: -10 })
      .expect(200)
      .then((res) => {
        expect(res.body.review.votes).toBe(-5);
      });
  });
  test("PATCH - 200 should return unchanged vote count if nothing is sent", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({})
      .expect(200)
      .then((res) => {
        expect(res.body.review.votes).toBe(5);
      });
  });
  test("PATCH - 400 invalid review_id", () => {
    return request(app)
      .patch("/api/reviews/nonsense")
      .send({ inc_votes: 10 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request!");
      });
  });
  test("PATCH - 400 inc_votes is not a number", () => {
    return request(app)
      .patch("/api/reviews/2")
      .send({ inc_votes: "ten" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request!");
      });
  });
  test("PATCH - 404 non-existent review_ID", () => {
    return request(app)
      .patch("/api/reviews/235")
      .send({ inc_votes: 10 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("review ID not found!");
      });
  });
});
