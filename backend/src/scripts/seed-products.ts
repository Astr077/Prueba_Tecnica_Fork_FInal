import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { ProductSchema } from '../products/schemas/product.schema';
import { UserSchema } from '../auth/schemas/user.schema';

dotenv.config({ path: '.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/catalogo-productos';

const products = [
  {
    nombre: 'Zapato Deportivo Azul',
    color: 'Azul',
    talla: '42',
    tipo: 'zapato',
    precio: 1299,
  },
  {
    nombre: 'Bolsa Tote Beige',
    color: 'Beige',
    talla: 'Única',
    tipo: 'bolsa',
    precio: 899,
  },
  {
    nombre: 'Zapato Casual Café',
    color: 'Café',
    talla: '40',
    tipo: 'zapato',
    precio: 1499,
  },
  {
    nombre: 'Bolsa de Hombro Negra',
    color: 'Negro',
    talla: 'Única',
    tipo: 'bolsa',
    precio: 1099,
  },
  {
    nombre: 'Zapato Formal Negro',
    color: 'Negro',
    talla: '41',
    tipo: 'zapato',
    precio: 1799,
  },
  {
    nombre: 'Zapato Running Rojo',
    color: 'Rojo',
    talla: '43',
    tipo: 'zapato',
    precio: 1599,
  },
  {
    nombre: 'Mochila Urbana Gris',
    color: 'Gris',
    talla: 'Única',
    tipo: 'bolsa',
    precio: 950,
  },
  {
    nombre: 'Zapato Oxford Cuero',
    color: 'Marrón',
    talla: '42',
    tipo: 'zapato',
    precio: 2199,
  },
  {
    nombre: 'Bolsa Crossbody Rosa',
    color: 'Rosa',
    talla: 'Única',
    tipo: 'bolsa',
    precio: 750,
  },
  {
    nombre: 'Sandalia Playera Blanca',
    color: 'Blanco',
    talla: '38',
    tipo: 'zapato',
    precio: 499,
  },
  {
    nombre: 'Bolsa Clutch Plateada',
    color: 'Plata',
    talla: 'Única',
    tipo: 'bolsa',
    precio: 1250,
  },
  {
    nombre: 'Bota de Cuero Negra',
    color: 'Negro',
    talla: '44',
    tipo: 'zapato',
    precio: 2499,
  },
  {
    nombre: 'Bolsa Mochila Verde',
    color: 'Verde',
    talla: 'Única',
    tipo: 'bolsa',
    precio: 899,
  },
  {
    nombre: 'Zapato Casual Azul',
    color: 'Azul',
    talla: '39',
    tipo: 'zapato',
    precio: 1199,
  },
  {
    nombre: 'Bolsa de Viaje Negra',
    color: 'Negro',
    talla: 'Única',
    tipo: 'bolsa',
    precio: 1899,
  },
  {
    nombre: 'Zapato Tenis Blanco',
    color: 'Blanco',
    talla: '41',
    tipo: 'zapato',
    precio: 1399,
  },
  {
    nombre: 'Bolsa Satchel Marrón',
    color: 'Marrón',
    talla: 'Única',
    tipo: 'bolsa',
    precio: 1450,
  },
  {
    nombre: 'Mocasín de Gamuza Azul',
    color: 'Azul',
    talla: '40',
    tipo: 'zapato',
    precio: 1699,
  },
  {
    nombre: 'Bolsa Tote Amarilla',
    color: 'Amarillo',
    talla: 'Única',
    tipo: 'bolsa',
    precio: 850,
  },
  {
    nombre: 'Zapato Deportivo Negro',
    color: 'Negro',
    talla: '42',
    tipo: 'zapato',
    precio: 1299,
  },
  {
    nombre: 'Cartera Clásica Roja',
    color: 'Rojo',
    talla: 'Única',
    tipo: 'bolsa',
    precio: 1150,
  },
  {
    nombre: 'Sandalia de Tacón Beige',
    color: 'Beige',
    talla: '37',
    tipo: 'zapato',
    precio: 1399,
  },
  {
    nombre: 'Bolsa de Playa Blanca',
    color: 'Blanco',
    talla: 'Única',
    tipo: 'bolsa',
    precio: 650,
  },
  {
    nombre: 'Zapato Skate Gris',
    color: 'Gris',
    talla: '41',
    tipo: 'zapato',
    precio: 1099,
  },
  {
    nombre: 'Bolsa de Mano Turquesa',
    color: 'Azul',
    talla: 'Única',
    tipo: 'bolsa',
    precio: 999,
  },
];

async function runSeed() {
  const maskedUri = MONGO_URI.replace(/:([^@]+)@/, ':******@');
  console.log(`Iniciando seed. Conectando a MongoDB: ${maskedUri}`);

  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);

  const ProductModel = mongoose.models.Product || mongoose.model('Product', ProductSchema);
  const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);

  // Seed Users
  console.log('Verificando usuarios iniciales...');
  
  const adminExists = await UserModel.findOne({ username: 'admin' });
  if (!adminExists) {
    const hashedAdminPassword = await bcrypt.hash('Admin123!', 10);
    const newAdmin = new UserModel({
      username: 'admin',
      password: hashedAdminPassword,
      role: 'admin',
    });
    await newAdmin.save();
    console.log('Usuario administrador creado: admin / Admin123!');
  } else {
    console.log('El usuario admin ya existe.');
  }

  const userExists = await UserModel.findOne({ username: 'user' });
  if (!userExists) {
    const hashedUserPassword = await bcrypt.hash('User123!', 10);
    const newUser = new UserModel({
      username: 'user',
      password: hashedUserPassword,
      role: 'user',
    });
    await newUser.save();
    console.log('Usuario común creado: user / User123!');
  } else {
    console.log('El usuario común ya existe.');
  }

  // Seed Products
  console.log('Limpiando catálogo existente de productos...');
  await ProductModel.deleteMany({});

  console.log('Insertando datos iniciales de productos...');
  await ProductModel.insertMany(products);
  console.log('Seed de productos completado con éxito.');


  await mongoose.disconnect();
}

runSeed().catch((error) => {
  console.error('Error al ejecutar seed:', error);
  mongoose.disconnect();
  process.exit(1);
});
