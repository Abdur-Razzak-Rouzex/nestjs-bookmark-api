import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  register() {
    return { msg: 'I am registered' };
  }

  login() {
    return 'I am logged in';
  }
}
