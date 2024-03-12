import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizDurationModule } from './quiz-sheet/quiz-duration.module';
import { ConfigModule } from '@nestjs/config';
// import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from './database/database.module';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { AuthModule } from './auth/auth.module';
import { QuizSheetConfigModule } from './quiz-sheet-config/quiz-sheet-config.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      'mongodb://localhost/e-learning?retryWrites=true&w=majority',
    ),
    QuizDurationModule,
    DatabaseModule,
    AuthModule,
    QuizSheetConfigModule,
  ],
})
export class AppModule {}
