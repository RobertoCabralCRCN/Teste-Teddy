import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ versionKey: false })
export class Product {
  @Prop({ type: mongoose.Schema.Types.Mixed, unique: true, required: true })
  code: string | number;

  @Prop({ default: 'draft' })
  status: string;

  @Prop({ default: Date.now() })
  imported_t: number;

  @Prop(/*{ required: true }*/)
  url: string;

  @Prop(/*{ required: true }*/)
  creator: string;

  @Prop(/*{ required: true }*/)
  created_t: number;

  @Prop(/*{ required: true }*/)
  last_modified_t: number;

  @Prop(/*{ required: true }*/)
  product_name: string;

  @Prop(/*{ required: true }*/)
  quantity: string;

  @Prop(/*{ required: true }*/)
  brands: string;

  @Prop(/*{ required: true }*/)
  categories: string;

  @Prop(/*{ required: true }*/)
  labels: string;

  @Prop()
  cities: string;

  @Prop()
  purchase_places: string;

  @Prop()
  stores: string;

  @Prop(/*{ required: true }*/)
  ingredients_text: string;

  @Prop()
  traces: string;

  @Prop(/*{ required: true }*/)
  serving_size: string;

  @Prop(/*{ required: true }*/)
  serving_quantity: number;

  @Prop(/*{ required: true }*/)
  nutriscore_score: number;

  @Prop(/*{ required: true }*/)
  nutriscore_grade: string;

  @Prop(/*{ required: true }*/)
  main_category: string;

  @Prop(/*{ required: true }*/)
  image_url: string;

  // Defina o _id como false para desativar a criação automática do campo _id
  @Prop({ select: false, _id: false })
  _id: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
