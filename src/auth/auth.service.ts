import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterAuthDto } from './dto/auth.dto';
import { Model } from 'mongoose';
import { UserModel } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { genSalt, compare, hash } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserModel.name) readonly userModel: Model<UserModel>,
    private readonly jwtService: JwtService,
  ) {}

  async createUser({ login, name, password }: RegisterAuthDto) {
    const salt = await genSalt(10);
    const newUser = new this.userModel({
      email: login,
      name: name,
      balance: 0,
      isActivated: false,
      amount: 0,
      passwordHash: await hash(password, salt),
    });
    return {
      data: newUser.save(),
      access_token: await this.jwtService.signAsync({email: login})
    };
  }

  async findUser(email: string): Promise<UserModel> {
    return await this.userModel.findOne({ email }).exec();
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<Pick<UserModel, 'email'>> {
    const user = await this.findUser(email);
    if (!user) {
      throw new BadRequestException(USER_NOT_FOUND_ERROR);
    }
    const isCorrectPassword = await compare(password, user.passwordHash);
    if (!isCorrectPassword) {
      throw new UnauthorizedException(WRONG_PASSWORD);
    }
    return {
      email: user.email,
    };
  }

  async getAll() {
    return await this.userModel.find().exec()
  }

  async login(email: string) {
    const payload = { email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async getOne(email: string) {
    return await this.userModel.findOne({email: email}).exec()
  }

  async updateField(field: string, data: number, userId: string) {
    return await this.userModel.updateOne(({_id: userId}), {
      $inc: {
        [field]: data
      }
    }).exec()
  }

  async updateStatus(userId: string, data: boolean) {
    return await this.userModel.updateOne({_id: userId}, {
      $set: {
        isActivated: data
      }
    }).exec()
  }

  decode(text: any): string {
    // @ts-ignore
    return this.jwtService.decode(text.authorization.split(' ')[1])
  }

  async deleteAll() {
    return await this.userModel.deleteMany().exec()
  }
}
