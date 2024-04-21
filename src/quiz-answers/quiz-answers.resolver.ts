import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { QuizAnswersService } from './quiz-answers.service';
import { QuizAnswersValidation } from './quiz-answers.validation';
import { CurrentUser } from 'src/user/user.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/role.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import {
  QuizAnswerType,
  QuizAnswersType,
  ResultQuizAnswerType,
  StudentQuizSubmitType,
} from './quiz-answers.type';
import {
  QuizAnswerFilterInput,
  QuizAnswerInput,
  QuizAnswerUpdateInput,
} from './quiz-answers.input';
import { GetCurrentUser } from 'src/auth/decorator/user.decorator';

@Resolver()
export class QuizAnswersResolver {
  constructor(
    private readonly quizAnswersService: QuizAnswersService,
    private readonly quizAnswersValidation: QuizAnswersValidation,
  ) {}

  @Query(() => QuizAnswersType)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async getQuizAnswers(
    @Args('quizAnswerFilterInput') quizAnswerFilterInput: QuizAnswerFilterInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.quizAnswersValidation.validateFilterInput(quizAnswerFilterInput);
    return this.quizAnswersService.getQuizAnswersService(
      quizAnswerFilterInput,
      currentUser,
    );
  }

  @Query(() => QuizAnswerType)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT', 'STUDENT')
  async getQuizStudentAnswers(
    @Args('submit_ID') submit_ID: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.quizAnswersService.getQuizStudentAnswersService(
      submit_ID,
      currentUser,
    );
  }

@Query(() => [StudentQuizSubmitType])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STUDENT')
  async getQuizzesStudentSubmit(
    @Args('course_cycle_ID') course_cycle_ID: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.quizAnswersService.getQuizzesStudentSubmitService(
      course_cycle_ID,
      currentUser,
    );
  }

  @Mutation(() => ResultQuizAnswerType)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('STUDENT')
  async submitQuizAnswer(
    @Args('quizAnswerInput') quizAnswerInput: QuizAnswerInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.quizAnswersValidation.validateQuizAnswerInput(quizAnswerInput);
    return this.quizAnswersService.submitQuizAnswerService(
      quizAnswerInput,
      currentUser,
    );
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async updateQuizAnswer(
    @Args('quizAnswerUpdateInput', { type: () => [QuizAnswerUpdateInput] })
    quizAnswerUpdateInput: QuizAnswerUpdateInput[],
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.quizAnswersValidation.validateQuizAnswerUpdateInput(
      quizAnswerUpdateInput,
    );
    return this.quizAnswersService.updateQuizAnswerService(
      quizAnswerUpdateInput,
      currentUser,
    );
  }
}
