import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Cars } from './cars.js';

console.log("Loaded validated methods");
export const insert = new ValidatedMethod({
  name: 'cars.insert',
  validate: Cars.simpleSchema().validator({ clean: true }),
  run({name, color}) {
    console.log("If you see this, it's probably working");
    const car = {
      name,
      color,
      createdAt: new Date()
    };

    console.log("Inserting Car", car);
    Cars.insert(car);
  }
});
