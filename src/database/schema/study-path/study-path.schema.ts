import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTypes } from 'mongoose';
import { UserEntity } from '../users/user.schema';
import { CourseEntity } from '../courses/course.schema';

export enum STUDY_STATUS {
  LOCKED = 1,
  UNLOCKED = 2,
  COMPLETED = 3,
}

@Schema()
export class StudyStatusEntity {
  @Prop({
    required: true,
  })
  element: string;
  @Prop({
    required: true,
    enum: [STUDY_STATUS.LOCKED, STUDY_STATUS.UNLOCKED, STUDY_STATUS.COMPLETED],
  })
  status: STUDY_STATUS;
  @Prop()
  lastStudy?: Date;
}
export const StudyStatusSchema =
  SchemaFactory.createForClass(StudyStatusEntity);
export type StudyStatusDocument = HydratedDocument<StudyStatusEntity>;

@Schema({ collection: 'study-path' })
export class StudyPathEntity {
  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: UserEntity.name,
  })
  user: UserEntity;
  @Prop({
    required: true,
  })
  score: string;
  @Prop({
    required: true,
  })
  period: number;
  @Prop({
    required: true,
  })
  remainDays: number;
  @Prop({
    required: true,
  })
  studiedChapter: number[];

  @Prop({
    required: true,
    type: SchemaTypes.ObjectId,
    ref: CourseEntity.name,
  })
  course: CourseEntity;
  @Prop({
    required: true,
    type: [StudyStatusSchema],
  })
  content: StudyStatusEntity[];
}

export const StudyPathSchema = SchemaFactory.createForClass(StudyPathEntity);
export type StudyPathDocument = HydratedDocument<StudyPathEntity>;
