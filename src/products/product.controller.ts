import {
  Controller,
  Get,
  Param,
  Body,
  Put,
  Delete,
  Query,
  Post,
} from '@nestjs/common';
import { ProductsService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductImportService } from './product-import.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly productImportService: ProductImportService,
  ) {}

  @Get()
  findAll(@Query('skip') skip: number, @Query('limit') limit: number) {
    return this.productsService.findAll(skip, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productsService.remove(id);
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleCron() {
    await this.productImportService.importarProdutos();
  }

  @Post('/import')
  async importProducts() {
    return await this.productImportService.importarProdutos();
  }
}
