import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "FoodExpress API",
            version: "1.0.0",
            description: "API for managing restaurants, menus, and users",
        },
        servers: [
            {
                url: "http://localhost:5000",
                description: "Server local foodExpress",
            },
        ],
    },
    apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };