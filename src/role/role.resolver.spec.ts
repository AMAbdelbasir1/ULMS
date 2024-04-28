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
        { role_ID: '1', name: 'Admin', created_at: new Date() },
        { role_ID: '2', name: 'User', created_at: new Date() },
      ];
      jest.spyOn(service, 'getAllRolesService').mockResolvedValue(mockRoles);

      // Call the resolver method with mock filter input
      const result = await resolver.getAllRoles({
        page: 1,
        limit: 10,
      } as RoleFilterInput);

      // Expect the resolver to return the mock data
      expect(result).toEqual(mockRoles);
    });

    // Add more test cases for different scenarios
  });

  describe('createRole', () => {
    it('should create a role', async () => {
      // Mock the service method to return the ID of the newly created role
      const successMessage = 'Role created successfuly';
      jest
        .spyOn(service, 'createRoleService')
        .mockResolvedValue(successMessage);

      // Call the resolver method with mock role input
      const result = await resolver.createRole({
        name: 'MANAGER',
      } as RoleInput);

      // Expect the resolver to return the ID of the newly created role
      expect(result).toEqual(successMessage);
    });

    // Add more test cases for different scenarios
  });

  describe('updateRole', () => {
    it('should update a role', async () => {
      // Mock the service method to return a success message
      const successMessage = 'Role updated successfully';
      jest
        .spyOn(service, 'updateRoleService')
        .mockResolvedValue(successMessage);

      // Call the resolver method with mock update input
      const result = await resolver.updateRole({
        role_ID: '0a7f47e9-d7f5-47ea-bdd5-bca3db0e8ba2',
        name: 'SuperAdmin',
      } as RoleUpdateInput);

      // Expect the resolver to return the success message
      expect(result).toEqual(successMessage);
    });

    // Add more test cases for different scenarios
  });

  describe('deleteRole', () => {
    it('should delete a role', async () => {
      // Mock the service method to return a success message
      const successMessage = 'Role deleted successfully';
      jest
        .spyOn(service, 'deleteRoleService')
        .mockResolvedValue(successMessage);

      // Call the resolver method with the role ID to delete
      const result = await resolver.deleteRole('0a7f47e9-d7f5-47ea-bdd5-bca3db0e8ba2');

      // Expect the resolver to return the success message
      expect(result).toEqual(successMessage);
    });

    // Add more test cases for different scenarios
  });
});
