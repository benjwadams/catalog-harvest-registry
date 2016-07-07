import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/car/:_id', {
  name: 'Cars.show',
  action() {
    console.log("Show a car");
  },
});

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    console.log("You're home");
  },
});
