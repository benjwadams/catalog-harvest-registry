import './list-cars.html';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Cars } from '/imports/api/cars/cars.js';

console.log("Template defined");
Template.listCars.onCreated(function() {
  console.log("Subscribing to cars");
  this.autorun(() => {
    this.subscribe('cars');
  });
});

Template.listCars.helpers({
  cars() {
    return Cars.find();
  }
});
