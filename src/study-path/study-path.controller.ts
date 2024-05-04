import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StudyPathService } from './study-path.service';
import { CreateStudyPathDto } from './dto/create-study-path.dto';
import { UpdateStudyPathDto } from './dto/update-study-path.dto';
import { RequestWithUser } from 'src/types/types';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('study-path')
export class StudyPathController {
  constructor(private readonly studyPathService: StudyPathService) {}

  @Post()
  create(
    @Body() createStudyPathDto: CreateStudyPathDto,
    @Req() req: RequestWithUser,
  ) {
    return this.studyPathService.create(req.user.id, createStudyPathDto);
  }

  // @Get()
  // findAll() {
  //   return this.studyPathService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.studyPathService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateStudyPathDto: UpdateStudyPathDto) {
  //   return this.studyPathService.update(+id, updateStudyPathDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.studyPathService.remove(+id);
  // }
}
