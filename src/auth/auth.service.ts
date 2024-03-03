import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable({})
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  async register(reqBody: AuthDto) {
    const hashedPassword = await argon2.hash(reqBody.password);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email: reqBody.email,
          password: hashedPassword,
        },
      });

      delete user.password;
      return user;
    } catch (error) {
      console.log('User registration error: ', error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already registered');
        }
      }

      throw error;
    }
  }

  async login(reqBody: AuthDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: reqBody.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const isPasswordMatched = await argon2.verify(
      user.password,
      reqBody.password,
    );
    if (!isPasswordMatched)
      throw new ForbiddenException('Credentials incorrect');

    delete user.password;
    return user;
  }
}
