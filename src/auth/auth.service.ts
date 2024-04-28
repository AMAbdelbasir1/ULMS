import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

import { LoginInput } from './auth.input';
import { DatabaseService } from '../database/database.service';
import { getOneUserEmailQuery } from '../database/queries/user.query';
import { graphqlError } from '../utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly conn: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async loginService(loginInput: LoginInput) {
    try {
      const { email, password } = loginInput;
      const user = await this.conn.query(getOneUserEmailQuery(email));

      if (user.recordset.length == 0) {
        throw 'NOT_VALID_USER';
      }
      if (!bcrypt.compareSync(password, user.recordset[0].password)) {
        throw 'NOT_VALID_USER';
      }
      return { Token: this.jwtService.sign({ id: user.recordset[0].user_ID }) };
    } catch (error) {
      if (error == 'NOT_VALID_USER') {
        graphqlError('Email Or Password incorrect', '403');
      }

      console.log(error);
      graphqlError('Something went wrong, Please try again', '500');
    }
  }
}
