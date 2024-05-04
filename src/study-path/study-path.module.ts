import { Module } from '@nestjs/common';
import { StudyPathService } from './study-path.service';
import { StudyPathController } from './study-path.controller';

@Module({
  controllers: [StudyPathController],
  providers: [StudyPathService],
})
export class StudyPathModule {}
