
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FastMusik Support API",
      version: "1.0.0",
      description:
        "Support microservice is responsible for handling all help request form users of the application"
    },
    servers: [
      {
        url: 'https://support-fastmusik-marmolpen3.cloud.okteto.net/support/v1',
        description: 'Development server',
      },
    ],
  },
  apis: ["./docs/**/*.yaml"],
};


const openapiSpecification = swaggerJsDoc(options);
const openapiDocs = (app) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(openapiSpecification);
  });
}

module.exports = { openapiDocs };