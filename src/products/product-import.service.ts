import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './entities/product.entity';
import axios from 'axios';
import * as readline from 'readline';
import * as zlib from 'zlib';
import { config } from 'src/config';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ProductImportService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async importarProdutos(): Promise<void> {
    const listFiles = await this.obterListaImportacao();

    for (const item of listFiles) {
      const productsToSave = await this.obterRegistros(item);
      await this.salvarRegistros(productsToSave);
    }
    console.log('Produtos importados com sucesso');

    return;
  }

  async obterListaImportacao(): Promise<string[]> {
    try {
      console.log('Obtendo lista de importação');
      const list = await axios.get(`${config.urls.challengeCode}/index.txt`);
      console.log('Lista Obtida com sucesso');

      return list.data
        ? list.data.split('\n').filter(Boolean)
        : config.fileList;
    } catch (error) {
      console.error('Error to get list files', JSON.stringify(error));
      return config.fileList;
    }
  }

  private async transformDataToProduct(jsonData: any): Promise<Product> {
    const productInstance = plainToClass(this.productModel, jsonData);

    const errors = await validate(productInstance);

    if (errors.length > 0) {
      throw new BadRequestException(`Erro de validação: ${errors}`);
    }

    return productInstance;
  }

  async obterRegistros(fileName: string): Promise<Product[]> {
    try {
      console.log(`Obtendo registros para importação -> Arquivo ${fileName}`);
      const fileContent = await axios.get(
        `${config.urls.challengeCode}/${fileName}`,
        { responseType: 'stream' },
      );
      console.log('registros obtidos com sucesso');

      // Descompacta o conteúdo
      const descompactador = zlib.createGunzip();

      // Cria uma interface de leitura de linha
      const leitorLinha: readline.Interface = readline.createInterface({
        input: fileContent.data.pipe(descompactador),
      });

      // Array para armazenar as 100 primeiras entradas
      const listProducts: Product[] = [];
      // Limita o número de entradas a serem processadas
      let contador = 0;
      const limite = config.productCountPerFile;

      leitorLinha.on('line', async (linha) => {
        const data = JSON.parse(linha);
        const transformedData = await this.transformDataToProduct(data);

        listProducts.push(transformedData);
        contador++;

        if (contador >= limite) {
          leitorLinha.close();
        }
      });

      return new Promise((resolve, reject) => {
        // Manipula eventos de conclusão do stream
        leitorLinha.on('close', () => {
          resolve(listProducts);
        });

        leitorLinha.on('error', (error) => {
          reject(error);
        });
      });
    } catch (error) {
      console.error('Error to import Products', JSON.stringify(error));
    }
  }

  async salvarRegistros(data: Product[]): Promise<void> {
    const dataToSave = data.slice(0, config.productCountPerFile);
    console.log(
      `Obtendo registros para gravação -> Quantidade ${dataToSave.length}`,
    );
    for (const product of dataToSave) {
      await this.productModel.updateOne(
        { code: product.code },
        { $set: product },
        { upsert: true },
      );
    }
    console.log(`Registros salvos com sucesso`);
  }
}
