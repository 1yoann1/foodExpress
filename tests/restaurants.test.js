import request from "supertest";
import mongoose from "mongoose";
import app from "../src/server.js";

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Restaurants API", () => {
  it("GET /restaurants list of restaurant", async () => {
    const res = await request(app).get("/restaurants");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /restaurants create restaurant", async () => {
    const newRestaurant = {
      name: "La Fouine Resto",
      address: "123 rue du goût",
      cuisine: "Italienne",
      rating: 4.5,
    };

    const res = await request(app).post("/restaurants").send(newRestaurant);
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("La Fouine Resto");
  });

  it("GET /restaurants/:id created restaurant", async () => {
    const newRestaurant = {
      name: "Restau 1",
      address: "456 avenue de auguste",
      cuisine: "Française",
      rating: 4.2,
    };
    const created = await request(app).post("/restaurants").send(newRestaurant);

    const res = await request(app).get(`/restaurants/${created.body._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Restau 1");
  });

  it("PUT /restaurants/:id - devrait mettre à jour un restaurant", async () => {
    const restaurant = await request(app).post("/restaurants").send({
      name: "UpdateMe",
      address: "Rue Blue",
      cuisine: "Mexicaine",
      rating: 3.5,
    });

    const updated = await request(app)
      .put(`/restaurants/${restaurant.body._id}`)
      .send({ rating: 5.0 });

    expect(updated.statusCode).toBe(200);
    expect(updated.body.rating).toBe(5.0);
  });

  it("DELETE /restaurants/:id delete restaurant", async () => {
    const restaurant = await request(app).post("/restaurants").send({
      name: "DeleteMe",
      address: "Rue Rouge",
      cuisine: "Japonaise",
      rating: 4.0,
    });

    const res = await request(app).delete(`/restaurants/${restaurant.body._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Restaurant deleted successfully");
  });
});