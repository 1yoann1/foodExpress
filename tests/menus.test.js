import request from "supertest";
import app from "../src/server.js";
import mongoose from "mongoose";

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
});

describe("Menus API", () => {
  it("GET /menus list of menus", async () => {
    const res = await request(app).get("/menus");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /menus create menu", async () => {
    const newMenu = {
      name: "Pizza Test",
      price: 12.5,
      restaurantId: "671c7ccf2fc13ae1d1a2b999",
    };

    const res = await request(app).post("/menus").send(newMenu);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Pizza Test");
  });
});