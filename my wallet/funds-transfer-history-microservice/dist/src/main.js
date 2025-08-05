"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle(process.env.SWAGGER_TITLE || 'Funds Transfer History API')
        .setDescription(process.env.SWAGGER_DESCRIPTION || 'API for managing funds transfer history')
        .setVersion(process.env.SWAGGER_VERSION || '1.0')
        .addTag('funds-transfer-history')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(process.env.SWAGGER_PATH || 'api', app, document);
    const port = process.env.PORT || 3003;
    await app.listen(port);
    console.log(`Funds Transfer History Microservice is running on port ${port}`);
    console.log(`Swagger UI is available at http://localhost:${port}/${process.env.SWAGGER_PATH || 'api'}`);
}
bootstrap();
//# sourceMappingURL=main.js.map