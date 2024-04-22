import { Injectable } from '@nestjs/common';
import { ReportQuestionRequest } from './dto/report-question.request';
import { InjectModel } from '@nestjs/mongoose';
import { NotificationEntity } from 'src/database/schema/notification/notifications.schema';
import { Model } from 'mongoose';
import { NOTIFICATION_TYPE } from 'src/config/constants';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(NotificationEntity.name)
    private readonly notificationModel: Model<NotificationEntity>,
  ) {}

  async reportQuestion(
    userId: string,
    { questionId, message }: ReportQuestionRequest,
  ): Promise<void> {
    const notification = new this.notificationModel({
      title: `Reported Question ${questionId}`,
      message: message,
      type: NOTIFICATION_TYPE.REPORT_QUESTION,
      userId,
      forAdmin: true,
    });
    await notification.save();
  }

  findAll() {
    return `This action returns all report`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  // update(id: number, updateReportDto: UpdateReportDto) {
  //   return `This action updates a #${id} report`;
  // }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
