import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { StudentInformationService } from './student-information.service';
import {
  // StudentInformationInput,
  StudentInformationUpdateInput,
} from './student-information.input';

@Resolver()
export class StudentInformationResolver {
  constructor(
    private readonly studentInformationService: StudentInformationService,
  ) {}

  // @Mutation(() => String)
  // async createStudentInformation(
  //   @Args('studentInput') studentInformationInput: StudentInformationInput,
  // ): Promise<string> {
  //   return this.studentInformationService.createStudentInformationService(
  //     studentInformationInput,
  //   );
  // }

  @Mutation(() => String)
  async updateStudentInformation(
    @Args('studentInput')
    studentInformationInput: StudentInformationUpdateInput,
  ): Promise<string> {
    return this.studentInformationService.updateStudentInformationService(
      studentInformationInput,
    );
  }

  // @Mutation(() => String)
  // async deleteRole(@Args('user_ID') user_ID: string): Promise<string> {
  //   return this.studentInformationService.deleteStudentInformationService(
  //     user_ID,
  //   );
  // }
}
