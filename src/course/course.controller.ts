import { Controller, Get } from '@nestjs/common';
import { CourseDocument } from 'src/database/schema/courses/course.schema';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  @Get()
  getListCourse(): Promise<CourseDocument[]> {
    return this.courseService.getListCourse();
  }

  @Get(':courseId')
  getCourseById(courseId: string): Promise<CourseDocument> {
    return this.courseService.getCourseById(courseId);
  }
}
