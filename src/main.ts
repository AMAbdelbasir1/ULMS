import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
// import { config } from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    graphqlUploadExpress({ maxFileSize: 10 * 1024 * 1024, maxFiles: 10 }),
  );
  // app.useGlobalPipes(new ValidationPipe());
  // config();
  await app.listen(3000);
}
bootstrap();
