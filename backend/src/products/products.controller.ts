import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ListProductsQueryDto } from './dto/query-products.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * GET /api/products
   * Obtener todos los productos
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: ListProductsQueryDto) {
    const products = await this.productsService.findAll(query);
    return {
      success: true,
      data: products,
      count: products.length,
    };
  }

  /**
   * GET /api/products/:id
   * Obtener un producto por ID
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string) {
    const product = await this.productsService.findById(id);
    return {
      success: true,
      data: product,
    };
  }

  /**
   * POST /api/products
   * Crear un nuevo producto
   */
  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);
    return {
      success: true,
      message: 'Producto creado exitosamente',
      data: product,
    };
  }

  /**
   * PUT /api/products/:id
   * Actualizar un producto
   */
  @Put(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.update(id, updateProductDto);
    return {
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product,
    };
  }

  /**
   * DELETE /api/products/:id
   * Eliminar un producto
   */
  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: string) {
    const result = await this.productsService.delete(id);
    return {
      success: true,
      message: result.message,
    };
  }
}
