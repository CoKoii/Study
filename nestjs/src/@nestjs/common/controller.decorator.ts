import "reflect-metadata";
export function Controller(): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata("controller", {}, target);
  };
}
