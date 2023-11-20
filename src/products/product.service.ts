import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import { StatusEnum, UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(skip: number, limit: number): Promise<Product[]> {
    const products = await this.productModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();
    return products;
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productModel.findOne({ code: id }).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existingProduct = await this.productModel
      .findOne({ code: id })
      .exec();

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    Object.assign(existingProduct, {
      status: updateProductDto.status,
      imported_t: updateProductDto.imported_t,
      url: updateProductDto.url,
      creator: updateProductDto.creator,
      created_t: updateProductDto.created_t,
      last_modified_t: Date.now(),
      product_name: updateProductDto.product_name,
      quantity: updateProductDto.quantity,
      brands: updateProductDto.brands,
      categories: updateProductDto.categories,
      labels: updateProductDto.labels,
      cities: updateProductDto.cities,
      purchase_places: updateProductDto.purchase_places,
      stores: updateProductDto.stores,
      ingredients_text: updateProductDto.ingredients_text,
      traces: updateProductDto.traces,
      serving_size: updateProductDto.serving_size,
      serving_quantity: updateProductDto.serving_quantity,
      nutriscore_score: updateProductDto.nutriscore_score,
      nutriscore_grade: updateProductDto.nutriscore_grade,
      main_category: updateProductDto.main_category,
      image_url: updateProductDto.image_url,
    });

    await this.productModel.updateOne({ code: id }, { $set: existingProduct });
    return existingProduct;
  }

  async remove(id: number): Promise<void> {
    const result = await this.productModel.findOne({ code: id }).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    Object.assign(result, {
      status: StatusEnum.trash,
    });
    await this.productModel.updateOne({ code: id }, { $set: result });
    console.log('alterei', result);
    return;
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
    return products;
  }
}
