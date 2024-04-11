import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

//Define Course schema
@Schema({ collection: 'courses', timestamps: true })
export class Course {
  @Prop({ required: true })
  name: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);

export type CourseDocument = HydratedDocument<Course>;
