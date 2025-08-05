"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const app_config_1 = require("./config/app.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Funds Transfer Microservice')
        .setDescription('API for handling funds transfers with commission validation')
        .setVersion('1.0')
        .addTag('funds-transfer')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    const port = app_config_1.appConfig.api.port;
    await app.listen(port);
    console.log(`Funds Transfer Microservice is running on port ${port}`);
    console.log(`Swagger documentation available at http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map