import { Injectable } from '@nestjs/common';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from 'src/database/schema/courses/course.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<Course>,
  ) {}
  async create(createCourseDto: Course): Promise<void> {
    await this.courseModel.create(createCourseDto);
  }

  findAll(): Promise<Course[]> {
    return this.courseModel.find().lean();
  }

  findOne(id: string): Promise<Course> {
    return this.courseModel.findById(id).lean();
  }

  update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    return this.courseModel.findOneAndUpdate(
      { _id: new mongoose.SchemaTypes.ObjectId(id) },
      { $set: updateCourseDto },
      { new: true, lean: true },
    );
  }

  remove(id: string) {
    return `This action removes a #${id} course`;
  }
}
