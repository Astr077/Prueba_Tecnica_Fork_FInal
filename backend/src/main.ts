import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para el frontend en desarrollo
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }
      const allowedOrigins = process.env.FRONTEND_URL
        ? process.env.FRONTEND_URL.split(',')
        : [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
          ];
      const isVercelPreview = /\.vercel\.app$/.test(origin);
      if (allowedOrigins.includes(origin) || isVercelPreview) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Usar ValidationPipe globalmente para validación automática de DTOs
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Prefijo para todas las rutas
  app.setGlobalPrefix('api');

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📋 API disponible en http://localhost:${PORT}/api`);
}

bootstrap();
