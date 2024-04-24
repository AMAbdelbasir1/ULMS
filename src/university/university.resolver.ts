import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UniversityType } from './university.type';
import { UniversityService } from './university.service';

import { universityUpdateInput } from './university.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/role.decorator';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { UniversityValidation } from './university.validation';
import { FileUpload } from 'src/utils/file.utils';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@Resolver(() => UniversityType)
export class UniversityResolver {
  constructor(
    private unvirstiyService: UniversityService,
    private readonly universityValidation: UniversityValidation,
  ) {}

  @Query(() => [UniversityType], { nullable: true })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async getUnvirsities() {
    return await this.unvirstiyService.getUnvirsitiesService();
  }

  @Query(() => UniversityType, { nullable: true })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async getOneUnvisity(
    @Args('university_ID') university_ID: string,
  ): Promise<UniversityType | null> {
    return await this.unvirstiyService.getOneUnvirsityService(university_ID);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async createUniversity(
    @Args('logo', { type: () => GraphQLUpload })
    logo: FileUpload,
    @Args('name') name: string,
  ): Promise<string> {
    return this.unvirstiyService.createUniversityService(name, logo);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async updateUniversity(
    @Args('updateInput') updateInput: universityUpdateInput,
  ): Promise<string> {
    this.universityValidation.validateUniversityUpdateInput(updateInput);

    return await this.unvirstiyService.updateUniversityService(updateInput);
  }

  @Mutation(() => String)
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('SUPERADMIN')
  async deleteUniversity(
    @Args('university_ID') university_ID: string,
  ): Promise<string> {
    this.universityValidation.validateUniversityUpdateInput({ university_ID });

    return await this.unvirstiyService.deleteUniversityService(university_ID);
  }
}
