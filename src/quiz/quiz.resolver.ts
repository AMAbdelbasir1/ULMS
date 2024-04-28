import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { QuizService } from './quiz.service';
import { CurrentUser } from '../user/user.input';
import { QuizFilterInput, QuizInput, QuizUpdateInput } from './quiz.input';
import { QuizType } from './quiz.type';
import { QuizValidation } from './quiz.validation';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorator/role.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { GetCurrentUser } from '../auth/decorator/user.decorator';

@Resolver()
export class QuizResolver {
  constructor(
    private readonly quizService: QuizService,
    private readonly quizValidation: QuizValidation,
  ) {}

  @Query(() => [QuizType])
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT', 'STUDENT')
  async getQuizzes(
    @Args('quizFilterInput') quizFilterInput: QuizFilterInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    return this.quizService.getQuizzesService(quizFilterInput, currentUser);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async createQuiz(
    @Args('quizInput') quizInput: QuizInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.quizValidation.validateQuizInput(quizInput);
    return this.quizService.createQuizService(quizInput, currentUser);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async updateQuiz(
    @Args('quizInput') quizUpdateInput: QuizUpdateInput,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.quizValidation.validateQuizUpdateInput(quizUpdateInput);
    return this.quizService.updateQuizService(quizUpdateInput, currentUser);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('DOCTOR', 'ASSISTANT')
  async deleteQuiz(
    @Args('quiz_ID') quiz_ID: string,
    @GetCurrentUser() currentUser: CurrentUser,
  ) {
    this.quizValidation.validateQuizUpdateInput({ quiz_ID });
    return this.quizService.deleteQuizService(quiz_ID, currentUser);
  }
}
