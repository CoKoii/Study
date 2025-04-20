"use strict";

const Person = {
  name: "Jonas",
  lastName: "Schmedtmann",
  birthYear: 1991,
  job: "teacher",
  friends: ["Michael", "Peter", "Steven"],
  sayhello: function () {
    console.log(this);
    console.log("hello,my name is " + this.name);
  },
};

for (let i in Person) {
  console.log(i);
}
