import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ReportQuestionRequest } from './dto/report-question.request';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/types/types';

@UseGuards(AuthGuard)
@Controller('report')
export class ReportController {
  constructor(private readonly reportService: NotificationService) {}

  @Post()
  reportQuestion(
    @Body() reportContent: ReportQuestionRequest,
    @Req() req: RequestWithUser,
  ) {
    return this.reportService.reportQuestion(req.user.id, reportContent);
  }

  @Get()
  findAll(@Req() req: RequestWithUser) {
    return this.reportService.findAll(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
  //   return this.reportService.update(+id, updateReportDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportService.remove(+id);
  }
}
