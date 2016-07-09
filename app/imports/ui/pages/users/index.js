import './index.jade';
import './index.less';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { Users } from '/imports/api/users/users.js';
import { Template } from 'meteor/templating';

Template.usersIndex.onCreated(function() {
  this.autorun(() => {
    Users.read(null, (error, response) => {
      if(error) { 
        Session.set('users', {error});
      } else {
        Session.set('users', response);
      }
    });
  });
});

Template.usersIndex.helpers({
  users() {
    return Session.get('users');
  }
});

Template.usersIndex.events({
  'click #new-user'(event) {
    FlowRouter.go('Users.new');
  },
  'click tr'(event) {
    FlowRouter.go('Users.edit', {userId: this.id});
  }
});

