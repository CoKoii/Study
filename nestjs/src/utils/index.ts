import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
export const getMysqlUsernameAndPassword = () => {
  const homedir = os.homedir();
  const usernamePath = path.resolve(homedir, '.vben', 'username');
  const passwordPath = path.resolve(homedir, '.vben', 'password');
  const username = fs.readFileSync(usernamePath).toString();
  const password = fs.readFileSync(passwordPath).toString();
  return { username, password };
};

export const success = <T = any>(data: T, message: string) => {
  return {
    code: 0,
    data,
    message,
  };
};

export const error = (msg: string) => {
  return {
    code: -1,
    msg,
  };
};

export const wrapperResponse = <T = any>(
  p: Promise<T>,
  msg: string,
): Promise<{ code: number; data?: T; message?: string; msg?: string }> => {
  return p
    .then((data) => success(data, msg))
    .catch((err: Error) => error(err.message));
};
