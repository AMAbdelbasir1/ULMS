import { Test, TestingModule } from '@nestjs/testing';
import { RoleResolver } from './role.resolver';
import { RoleService } from './role.service';
import { RoleValidation } from './role.validation';
import { RoleInput, RoleUpdateInput, RoleFilterInput } from './role.input';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';

describe('RoleResolver', () => {
  let resolver: RoleResolver;
  let service: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoleResolver, RoleService, RoleValidation],
      imports: [DatabaseModule, AuthModule],
    }).compile();

    resolver = module.get<RoleResolver>(RoleResolver);
    service = module.get<RoleService>(RoleService);
  });

  describe('getAllRoles', () => {
    it('should return all roles', async () => {
      // Mock the service method to return some mock data
      const mockRoles = [
        {
          role_ID: '0a7f47e9-d7f5-47ea-bdd5-bca3db0e8ba2',
          name: 'SUPERADMIN',
          created_at: new Date('2024-03-26T20:08:05.480Z'),
        },
        {
          role_ID: '19600166-4a8b-477c-9450-daf036aa31af',
          name: 'STUDENT',
          created_at: new Date('2024-04-24T21:20:16.477Z'), //
        },
      ];
      jest.spyOn(service, 'getAllRolesService');

      // Call the resolver method with mock filter input
      const result = await resolver.getAllRoles({
        page: 1,
        limit: 2,
      } as RoleFilterInput);

      // Expect the resolver to return the mock data
      expect(result).toEqual(mockRoles);
    });

    // Add more test cases for different scenarios
  });

  describe('createRole', () => {
    it('should create a role', async () => {
      try {
        // Mock the service method to return the ID of the newly created role
        const successMessage = 'Role created successfuly';
        jest.spyOn(service, 'createRoleService');

        // Call the resolver method with mock role input
        const result = await resolver.createRole({
          name: 'MANAGER',
        } as RoleInput);

        // Expect the resolver to return the ID of the newly created role
        expect(result).toEqual(successMessage);
      } catch (error) {
        // Expect the resolver to throw an error
        expect(error.message).toEqual('Role already exists');
      }
    });

    // Add more test cases for different scenarios
  });

  describe('updateRole', () => {
    it('should update a role', async () => {
      try {
        // Mock the service method to return a success message
        const successMessage = 'Role updated successfully';
        jest.spyOn(service, 'updateRoleService');

        // Call the resolver method with mock update input
        const result = await resolver.updateRole({
          role_ID: '0a7f47e9-d7f5-47ea-bdd5-bca3db0e8ba2',
          name: 'SUPERADMIN',
        } as RoleUpdateInput);

        // Expect the resolver to return the success message
        expect(result).toEqual(successMessage);
      } catch (error) {
        expect(error.message).toEqual('Role already exists');
      }
    });

    // Add more test cases for different scenarios
  });

  describe('deleteRole', () => {
    it('should delete a role', async () => {
      try {
        // Mock the service method to return a success message
        const successMessage = 'Role deleted successfully';
        jest.spyOn(service, 'deleteRoleService');

        // Call the resolver method with the role ID to delete
        const result = await resolver.deleteRole(
          '0a7f47e9-d7f5-47ea-bdd5-bca3db0e8ba2',
        );

        // Expect the resolver to return the success message
        expect(result).toEqual(successMessage);

        // Add more test cases for different scenarios
      } catch (error) {
        expect(error.message).toEqual('Something went wrong, Please try again');
      }
    });
  });
});
