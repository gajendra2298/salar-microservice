"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Funds Received Microservice')
        .setDescription('API documentation for the Funds Received Microservice')
        .setVersion('1.0')
        .addTag('Funds Received', 'Endpoints for managing funds received data')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
        customSiteTitle: 'Funds Received API Documentation',
    });
    await app.listen(3004);
    console.log('Funds Received Microservice is running on port 3004');
    console.log('Swagger UI is available at: http://localhost:3004/api');
}
bootstrap();
//# sourceMappingURL=main.js.map