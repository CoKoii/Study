import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUsers() {
    return {
      code: 0,
      data: [],
      message: '请求用户列表成功',
    };
  }

  addUser() {
    return {
      code: 0,
      data: null,
      message: '添加用户成功',
    };
  }
  rangeUser(num: number) {
    const arr: string[] = [];
    for (let i = 1; i <= num; i++) {
      arr.push(i.toString());
      console.log(i);
    }
    return {
      code: 0,
      data: arr,
      message: '操作成功',
    };
  }
}
