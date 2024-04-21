import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionResolver } from './question.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { QuestionValidation } from './question.validation';

@Module({
  imports: [DatabaseModule],
  providers: [QuestionService, QuestionResolver, QuestionValidation],
})
export class QuestionModule {}
