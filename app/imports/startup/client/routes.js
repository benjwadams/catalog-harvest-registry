import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/layouts/app-body.js';
import '/imports/ui/pages/insert-car-form.js';
import '/imports/ui/pages/list-cars.js';

FlowRouter.route('/cars', {
  name: 'Cars.list',
  action() {
    console.log("List some cars");
    BlazeLayout.render('App_body', { main: 'listCars' });
  },
});

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    console.log("You're home");
    BlazeLayout.render('App_body', { main: 'insertCarForm' });
  },
});

// the App_notFound template is used for unknown routes
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
