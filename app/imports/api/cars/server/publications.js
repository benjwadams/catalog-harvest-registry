import { Meteor } from 'meteor/meteor';
import { Cars } from '../cars.js';

console.log("Publishing cars");
Meteor.publish('cars', function carsPublication() {
  return Cars.find();
});
