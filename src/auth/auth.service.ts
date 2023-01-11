import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { AuthDto } from './../dto/auth.dto';
import { PrismaService } from './../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  async signup(dto: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);
    //save the new user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });

      delete user.hash;
      //return the saved user
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'p2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin( dto: AuthDto) {

    // find the user by id
    const user = await this.prisma.user.findUnique({
      where:{
        email: dto.email,
      },
    });
    // if user does not exist throw exception
    if (!user)
    throw new ForbiddenException('Credentials incorrect',
    );


    // compare password
    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );
    // if password incorrect throw exception
    if (!pwMatches)
    throw new ForbiddenException('Credentials incorrect',
    );
    //send back the user
      delete user.hash;
      return user;
    
  }
}
