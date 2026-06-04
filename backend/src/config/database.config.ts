import { MongooseModuleOptions } from '@nestjs/mongoose';

export const databaseConfig = (): MongooseModuleOptions => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/catalogo-productos';

  return {
    uri: mongoUri,
    retryAttempts: 5,
    retryDelay: 1000,
  };
};
