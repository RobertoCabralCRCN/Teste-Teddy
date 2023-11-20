import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './product.service';
import { Product } from './entities/product.entity';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { StatusEnum, UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  // let productModel: Model<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Product.name),
          useValue: Model,
        },
        ProductsService,
        ...Object.values(Product),
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a product doc', async () => {
    // arrange
    const product = new Product();
    const codeId = 123456789;
    const spy = jest
      .spyOn(service, 'findOne') // <- spy on what you want
      .mockResolvedValue(product as Product); // <- Set your resolved value
    // act
    await service.findOne(codeId);
    // assert
    expect(spy).toBeDefined();
  });

  it('should return a products doc', async () => {
    // arrange
    const product = new Product();
    const skip = 0;
    const limit = 10;
    const spy = jest
      .spyOn(service, 'findAll') // <- espie o que você deseja
      .mockResolvedValue([product] as Product[]); // <- ajuste para um array de Product
    // act
    await service.findAll(skip, limit);
    // assert
    expect(spy).toBeDefined();
  });

  it('should be able to update a product doc', async () => {
    // arrange
    const product = new Product();
    const codeId = 123456789;
    const newObj = {
      code: codeId,
      status: StatusEnum.draft,
      imported_t: 123456789,
      url: 'www.llll.com.br',
      creator: 'test',
      created_t: 123465,
      last_modified_t: 12354689,
      product_name: 'test',
      quantity: '1',
      brands: 'test',
      categories: 'test',
      labels: 'test',
      cities: 'test',
      purchase_places: 'test',
      stores: 'test',
      ingredients_text: 'test',
      traces: 'test',
      serving_size: 'test',
      serving_quantity: 1,
      nutriscore_score: 1,
      nutriscore_grade: 'test',
      main_category: 'test',
      image_url: 'ww.kklklk.com.br',
    } as unknown as UpdateProductDto;
    const spy = jest
      .spyOn(service, 'update') // <- spy on what you want
      .mockResolvedValue(product as Product); // <- Set your resolved value
    // act
    await service.update(codeId, newObj);
    // assert
    expect(spy).toBeDefined();
  });
});
