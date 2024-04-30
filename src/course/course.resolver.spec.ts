import { Test, TestingModule } from '@nestjs/testing';
import { CourseResolver } from './course.resolver';
import { CourseService } from './course.service';
import {
  CourseInput,
  CourseUpdateInput,
  CourseFilterInput,
} from './course.input';
import { CourseType } from './course.type';
import { CurrentUser } from '../user/user.input';
import { CourseValidation } from './course.validation';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

interface MockFileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: jest.Mock;
}

describe('CourseResolver', () => {
  let resolver: CourseResolver;
  let service: CourseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseResolver, CourseService, CourseValidation],
      imports: [DatabaseModule, AuthModule],
    }).compile();

    resolver = module.get<CourseResolver>(CourseResolver);
    service = module.get<CourseService>(CourseService);
  });

  describe('getCourses', () => {
    it('should return courses', async () => {
      const filterInput: CourseFilterInput = { page: 1, limit: 10 };
      const currentUser: CurrentUser = {
        user_ID: '3ed4621a-285e-460c-af09-8364cf563508',
        Faculty_ID: 'a90e5899-0096-4cf0-b8e6-14529e0302a9',
        roles: ['ADMIN'],
      }; // Mock current user

      jest.spyOn(service, 'getCoursesService');

      const result: CourseType = await resolver.getCourses(
        filterInput,
        currentUser,
      );

      expect(result).toEqual([
        {
          course_ID: expect.any(String),
          name: expect.any(String),
          hours: expect.any(Number),
          image_path: expect.any(String),
          Faculty_ID: expect.any(String),
          created_at: expect.any(Date),
        },
      ]);
    });
  });

  describe('createCourse', () => {
    it('should create a course', async () => {
      const mockImage: MockFileUpload = {
        filename: 'image.jpg',
        mimetype: 'image/jpeg',
        encoding: 'base64',
        createReadStream: jest.fn(),
      };
      const courseInput: CourseInput = {
        name: 'New Course',
        hours: 20,
        image: Promise.resolve(mockImage),
      };
      const currentUser: CurrentUser = {
        user_ID: 'user_id',
        Faculty_ID: 'faculty_id',
        roles: ['ADMIN'],
      }; // Mock current user

      jest
        .spyOn(service, 'createCourseService')
        .mockResolvedValueOnce('Course created successfully');

      const result: string = await resolver.createCourse(
        courseInput,
        currentUser,
      );

      expect(result).toEqual('Course created successfully');
    });
  });

  describe('updateCourse', () => {
    it('should update a course', async () => {
      try {
        const mockImage: MockFileUpload = {
          filename: 'image.jpg',
          mimetype: 'image/jpeg',
          encoding: 'base64',
          createReadStream: jest.fn(),
        };
        const courseUpdateInput: CourseUpdateInput = {
          course_ID: '1',
          name: 'Updated Course',
          hours: 30,
          image: Promise.resolve(mockImage),
        };
        const currentUser: CurrentUser = {
          user_ID: 'user_id',
          Faculty_ID: 'faculty_id',
          roles: ['ADMIN'],
        }; // Mock current user

        jest
          .spyOn(service, 'updateCourseService')
          .mockResolvedValueOnce('Course updated successfully');

        const result: string = await resolver.courseUpdate(
          courseUpdateInput,
          currentUser,
        );

        expect(result).toEqual('Course updated successfully');
      } catch (error) {
        expect(['Course already exists', 'Error data valdation']).toContain(
          error.message,
        );
      }
    });
  });

  describe('deleteCourse', () => {
    it('should delete a course', async () => {
      try {
        const course_ID = 'deddddddddd';
        const currentUser: CurrentUser = {
          user_ID: 'user_id',
          Faculty_ID: 'faculty_id',
          roles: ['ADMIN'],
        }; // Mock current user

        jest
          .spyOn(service, 'deleteCourseService')
          .mockResolvedValueOnce('Course deleted successfully');

        const result: string = await resolver.deleteCourse(
          course_ID,
          currentUser,
        );

        expect(result).toEqual('Course deleted successfully');
      } catch (error) {
        expect(['Course not found', 'Error data valdation']).toContain(
          error.message,
        );
      }
    });
  });
});
