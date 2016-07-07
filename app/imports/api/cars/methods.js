import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Cars } from './cars.js';

export const insert = new ValidatedMethod({
  name: 'cars.insert',
  validate: Cars.simpleSchema().validator({ clean: true }),
  run({name, color}) {
    const car = {
      name,
      color,
      createdAt: new Date()
    };

    Cars.insert(car);
  }
});
