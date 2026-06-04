import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  /**
   * Obtener todos los productos con filtros opcionales
   */
  async findAll(filters?: {
    tipo?: string;
    search?: string;
    minPrecio?: number;
    maxPrecio?: number;
  }): Promise<Product[]> {
    const query: FilterQuery<Product> = {};

    if (filters?.tipo) {
      query.tipo = filters.tipo;
    }

    if (filters?.search) {
      query.nombre = { $regex: filters.search, $options: 'i' };
    }

    const priceFilter: Record<string, number> = {};
    if (filters?.minPrecio !== undefined) {
      priceFilter.$gte = filters.minPrecio;
    }
    if (filters?.maxPrecio !== undefined) {
      priceFilter.$lte = filters.maxPrecio;
    }
    if (Object.keys(priceFilter).length) {
      query.precio = priceFilter as any;
    }

    return this.productModel.find(query).exec();
  }

  /**
   * Obtener un producto por ID
   */
  async findById(id: string): Promise<Product> {
    try {
      const product = await this.productModel.findById(id).exec();
      if (!product) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }
      return product;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('ID de producto inválido');
    }
  }

  /**
   * Crear un nuevo producto
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const newProduct = new this.productModel(createProductDto);
      return await newProduct.save();
    } catch (error) {
      throw new BadRequestException('Error al crear el producto');
    }
  }

  /**
   * Actualizar un producto
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    try {
      const updatedProduct = await this.productModel
        .findByIdAndUpdate(id, updateProductDto, {
          new: true,
          runValidators: true,
        })
        .exec();

      if (!updatedProduct) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      return updatedProduct;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar el producto');
    }
  }

  /**
   * Eliminar un producto
   */
  async delete(id: string): Promise<{ message: string }> {
    try {
      const deletedProduct = await this.productModel
        .findByIdAndDelete(id)
        .exec();

      if (!deletedProduct) {
        throw new NotFoundException(`Producto con ID ${id} no encontrado`);
      }

      return { message: 'Producto eliminado exitosamente' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar el producto');
    }
  }
}
