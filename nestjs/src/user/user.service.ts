import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUser() {
    return { id: 1, name: 'John Doe' };
  }
  addUser() {
    return { message: 'User added successfully' };
  }
}
