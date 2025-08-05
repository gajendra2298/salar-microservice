"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const app_config_1 = require("./config/app.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle(app_config_1.appConfig.swagger.title)
        .setDescription(app_config_1.appConfig.swagger.description)
        .setVersion(app_config_1.appConfig.swagger.version)
        .addTag('funds-transfer')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(app_config_1.appConfig.api.port);
    console.log(`Funds Transfer Microservice is running on port ${app_config_1.appConfig.api.port}`);
    console.log(`Swagger UI is available at http://localhost:${app_config_1.appConfig.api.port}/api`);
    console.log(`Environment: ${app_config_1.appConfig.api.environment}`);
    console.log(`Log Level: ${app_config_1.appConfig.logging.level}`);
}
bootstrap();
//# sourceMappingURL=main.js.map