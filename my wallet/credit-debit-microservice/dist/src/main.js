"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Credit/Debit Microservice API')
        .setDescription('API documentation for Credit/Debit Microservice')
        .setVersion('1.0')
        .addTag('credit-debit')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(3005);
    console.log('Credit/Debit Microservice is running on port 3005');
    console.log('Swagger UI is available at http://localhost:3005/api');
}
bootstrap();
//# sourceMappingURL=main.js.map