import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Course,
  CourseDocument,
} from 'src/database/schema/courses/course.schema';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

  getListCourse(): Promise<CourseDocument[]> {
    return this.courseModel.find().lean();
  }

  async getCourseById(courseId: string): Promise<CourseDocument> {
    const course = await this.courseModel.findById(courseId);
    if (!course) {
      throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
    }
    return course;
  }
}
