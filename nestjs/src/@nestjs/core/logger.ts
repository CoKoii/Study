import * as clc from "cli-color";
export class Logger {
  static log(message: string, context: string = "") {
    const timestamp = new Date().toLocaleString();
    const pid = process.pid;
    console.log(
      `${clc.green("[Nest]")} ${clc.green(
        pid.toString()
      )} - ${timestamp} ${clc.green("LOG")} ${clc.yellow(
        `[${context}]`
      )} ${clc.green(message)}`
    );
  }
}
