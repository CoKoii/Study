import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUser() {
    return { id: 10, name: 'John Doe' };
  }
}
