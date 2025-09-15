import "reflect-metadata";
export function Get(): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    Reflect.defineMetadata("http:method", "GET", descriptor.value);
  };
}
