import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { AppDataSource } from 'src/data-source';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import GetUserDTO from './dto/get-user.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor() {}

  async userExistsByEmail(email: string): Promise<boolean> {
    const result = await AppDataSource.query(
      `SELECT 1 FROM users WHERE email = ? LIMIT 1`,
      [email],
    );
    return result.length > 0;
  }

  async create(createUserDTO: CreateUserDTO): Promise<boolean> {
    const { email, password } = createUserDTO;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    try {
      const existByEmail = await this.userExistsByEmail(email);
      if (existByEmail) {
        throw new HttpException(
          'User already registered with email: ' + email,
          HttpStatus.BAD_REQUEST,
        );
      }
      const uuid = uuidv4();
      await AppDataSource.query(
        `INSERT INTO users (user_id, email, password) VALUES (?, ?, ?)`,
        [uuid, email, hashedPassword],
      );
      return true;
    } catch (error) {
      throw new HttpException(
        'Could not create user: ' + error,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateUser(email: string, plainPassword: string): Promise<boolean> {
    const result = await AppDataSource.query(
      `SELECT password FROM users WHERE email = ?`,
      [email],
    );

    if (result.length === 0) return false;

    const hashedPassword = result[0].password;
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async getUserById(userId : string): Promise<GetUserDTO> {
    const result = await AppDataSource.query(`
        SELECT * FROM users WHERE user_id = ?
      `,[userId]);
    if (result.length > 0) {
      return {userId: result[0].user_id, email: result[0].email};
    }
    throw new HttpException("User not found", HttpStatus.NOT_FOUND);
  }
}
