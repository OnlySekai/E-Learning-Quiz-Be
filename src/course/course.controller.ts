import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from 'src/database/schema/courses/course.schema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @ApiOperation({ summary: 'Create a new course' })
  @Post()
  create(@Body() courses: Course): Promise<void> {
    return this.courseService.create(courses);
  }

  @ApiOperation({ summary: 'Get all courses' })
  @Get()
  findAll(): Promise<Course[]> {
    return this.courseService.findAll();
  }

  @ApiOperation({ summary: 'Get a course by id' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Course> {
    return this.courseService.findOne(id);
  }

  @ApiOperation({ summary: 'Update a course by id' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
