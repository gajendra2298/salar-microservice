"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: configService.get('cors.origin'),
        credentials: configService.get('cors.credentials'),
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle(configService.get('swagger.title'))
        .setDescription(configService.get('swagger.description'))
        .setVersion(configService.get('swagger.version'))
        .addTag('wallet')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup(configService.get('api.prefix'), app, document);
    const port = configService.get('port');
    await app.listen(port);
    console.log(`Wallet Microservice is running on port ${port}`);
    console.log(`Swagger UI is available at http://localhost:${port}/${configService.get('api.prefix')}`);
    console.log(`Environment: ${configService.get('nodeEnv')}`);
}
bootstrap();
//# sourceMappingURL=main.js.map