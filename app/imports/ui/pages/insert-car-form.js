import './insert-car-form.html';
import { Cars } from '/imports/api/cars/cars';
import { Template } from 'meteor/templating';

// https://github.com/aldeed/meteor-autoform/issues/1449
Template.insertCarForm.helpers({
  formCollection() {
    return Cars;
  }
});

