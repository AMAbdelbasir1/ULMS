import { Module } from '@nestjs/common';
import { QuizAnswersResolver } from './quiz-answers.resolver';
import { QuizAnswersService } from './quiz-answers.service';
import { DatabaseModule } from 'src/database/database.module';
import { QuizAnswersValidation } from './quiz-answers.validation';

@Module({
  imports: [DatabaseModule],
  providers: [QuizAnswersResolver, QuizAnswersService, QuizAnswersValidation],
})
export class QuizAnswersModule {}
