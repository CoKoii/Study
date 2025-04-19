"use strict";

const Person = {
  name: "Jonas",
  lastName: "Schmedtmann",
  birthYear: 1991,
  job: "teacher",
  friends: ["Michael", "Peter", "Steven"],
};

console.log(Person.name);
console.log(Person["name"]);
const nameKey = "Name";
console.log(Person["last" + nameKey]);
