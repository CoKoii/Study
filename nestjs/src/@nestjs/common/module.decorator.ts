import "reflect-metadata";
interface ModuleMetadata {
  controllers: Function[];
}
export function Module(metadata: ModuleMetadata): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata("module", metadata, target);
  };
}
