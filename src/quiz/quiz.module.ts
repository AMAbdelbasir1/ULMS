import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizResolver } from './quiz.resolver';
import { DatabaseModule } from '../database/database.module';
import { QuizValidation } from './quiz.validation';

@Module({
  imports: [DatabaseModule],
  providers: [QuizService, QuizResolver, QuizValidation],
})
export class QuizModule {}
