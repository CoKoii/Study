import "reflect-metadata";
class MyClass {
  private myProperty: string;
  constructor(value: string) {
    this.myProperty = value;
  }
  @Reflect.metadata("customerKey", "customValue")
  myMethod() {
    console.log("Executing myMethod");
  }
}
const instance = new MyClass("Hello, World!");
Reflect.defineMetadata("key1", "value1", instance, "myProperty");
console.log(Reflect.getMetadata("key1", instance, "myProperty"));
console.log(
  Reflect.getOwnMetadata("customerKey", MyClass.prototype, "myMethod")
);
