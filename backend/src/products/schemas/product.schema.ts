import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, trim: true })
  nombre: string;

  @Prop({ required: true, trim: true })
  color: string;

  @Prop({ required: true, trim: true })
  talla: string;

  @Prop({
    required: true,
    enum: ['zapato', 'bolsa'],
    lowercase: true,
  })
  tipo: string;

  @Prop({ required: true, min: 0 })
  precio: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
