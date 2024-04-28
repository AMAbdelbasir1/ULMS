import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { DatabaseService } from '../database/database.service';
import {
  deleteOneRoleQuery,
  getAllRoleQuery,
  getOneRoleQuery,
  getRoleByNameQuery,
  insertRoleQuery,
  updateRoleQuery,
} from '../database/queries/role.query';
import { RoleFilterInput, RoleInput, RoleUpdateInput } from './role.input';
import { handleError } from '../utils/graph.error';
import { errorMessage } from './message.error';

@Injectable()
export class RoleService {
  constructor(private readonly conn: DatabaseService) {}

  async getAllRolesService(filterInput: RoleFilterInput) {
    try {
      const roles = await this.conn.query(
        getAllRoleQuery(filterInput.page || 1, filterInput.limit || 30),
      );

      return roles.recordset;
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  async createRoleService(roleInput: RoleInput) {
    try {
      const existingRole = await this.conn.query(
        getRoleByNameQuery(roleInput.name),
      );

      if (existingRole.recordset.length > 0) {
        throw 'EXISTS_ROLE';
      }

      await this.conn.query(insertRoleQuery(uuid(), roleInput.name));

      return 'Role created successfuly';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  async updateRoleService(roleUpdateInput: RoleUpdateInput) {
    const { role_ID, ...updateInput } = roleUpdateInput;
    try {
      if (Object.keys(updateInput).length === 0) {
        throw 'ENTER_DATA';
      }

      const [existingRole, existingRoleName] = await Promise.all([
        this.conn.query(getOneRoleQuery(role_ID)),
        this.conn.query(getRoleByNameQuery(updateInput.name)),
      ]);

      if (existingRole.recordset.length === 0) {
        throw 'ROLE_NOT_FOUND';
      }
      if (existingRoleName.recordset.length > 0) {
        throw 'EXISTS_ROLE';
      }

      await this.conn.query(updateRoleQuery(roleUpdateInput));

      return 'Role updated successfully';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }

  async deleteRoleService(role_ID: string) {
    try {
      const existingRole = await this.conn.query(getOneRoleQuery(role_ID));

      if (existingRole.recordset.length === 0) {
        throw 'ROLE_NOT_FOUND';
      }

      await this.conn.query(deleteOneRoleQuery(role_ID));

      return 'Role deleted successfuly';
    } catch (error) {
      handleError(error, errorMessage);
    }
  }
}
