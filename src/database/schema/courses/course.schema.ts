import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

@Schema()
class CourseFigure {
  @Prop({ required: true })
  figureName: string;

  @Prop({ required: true })
  figureNumber: number;
}

export const courseFigureSchema = SchemaFactory.createForClass(CourseFigure);
export type CourseFigureDocument = HydratedDocument<CourseFigure>;

@Schema()
export class CourseChapter {
  @Prop({ required: true })
  chapterName: string;

  @Prop({ required: true })
  chapterNumber: number;

  @Prop({ required: true, type: [courseFigureSchema] })
  figures: CourseFigure[];
}

//Define Course schema
@Schema({ collection: 'course_contents', timestamps: true })
export class Course {
  _id?: ObjectId;
  
  @Prop({ required: true })
  courseName: string;

  @Prop({ required: true, type: [CourseChapter] })
  chapters: CourseChapter[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);
export type CourseDocument = HydratedDocument<Course>;
