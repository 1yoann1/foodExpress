import request from "supertest";
import app from "../src/server.js";
import mongoose from "mongoose";

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Users API", () => {
  it("GET /users list of user", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toBe(200);
  });

  it("POST /auth/register create user", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "yoannTest",
      email: "yoann@test.com",
      password: "123456",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message");
  });
});
