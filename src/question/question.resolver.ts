import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { QuestionService } from './question.service';
import { QuestionValidation } from './question.validation';
import { QuestionType } from './question.type';
import {
  AnswerUpdateInput,
  QuestionFilterInput,
  QuestionUpdateInput,
  QuestionsInput,
} from './question.input';
import { CurrentUser } from '../user/user.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorator/role.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { GetCurrentUser } from '../auth/decorator/user.decorator';

@Resolver()
export class QuestionResolver {
  constructor(
    private readonly questionService: QuestionService,
    private readonly questionValidation: QuestionValidation,
  ) {}

  @Query(() => [QuestionType])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT', 'STUDENT')
  async getQuestions(
    @Args('filterInput') filterInput: QuestionFilterInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.questionValidation.validateFilterInput(filterInput);
    return this.questionService.getQuestionsService(filterInput, currentUser);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async insertQuestions(
    @Args('questionsInput')
    questionsInput: QuestionsInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ): Promise<string> {
    this.questionValidation.validateQuestionInput(questionsInput);
    return this.questionService.insertQuestionsService(
      questionsInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async updateQuestion(
    @Args('updateQuestionInput') updateQuestionInput: QuestionUpdateInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.questionValidation.validateQuestionUpdateInput(updateQuestionInput);

    return this.questionService.updateQuestionService(
      updateQuestionInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async deleteQuestion(
    @Args('question_ID') question_ID: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.questionValidation.validateQuestionUpdateInput({ question_ID });

    return this.questionService.deleteQuestionService(question_ID, currentUser);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async updateAnswer(
    @Args('answerUpdateInput') answerUpdateInput: AnswerUpdateInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.questionValidation.validateAnswerUpdateInput(answerUpdateInput);
    return this.questionService.updateAnswerService(
      answerUpdateInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async deleteAnswer(
    @Args('answer_ID') answer_ID: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.questionValidation.validateAnswerUpdateInput({ answer_ID });
    return this.questionService.deleteAnswerService(answer_ID, currentUser);
  }
}
