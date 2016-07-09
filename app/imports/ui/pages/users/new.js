import './new.jade';

import { Users } from '/imports/api/users/users.js';
import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { AutoForm } from 'meteor/aldeed:autoform';

Template.usersNew.helpers({
  formSchema() {
    return Users.schema.pick(Users.formFields);
  },
  success() {
    return Session.get('success');
  },
  doc() {
    return Session.get('doc');
  }
});

AutoForm.hooks({
  newUser: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      var self = this;
      this.event.preventDefault();
      console.log("Submitting");
      Users.create(insertDoc, function(error, response) {
        Session.set('doc', insertDoc);
        self.done(error, response);
      });

    },
    onSuccess: function(formType, result) {
      Session.set('success', true);
      Meteor.setTimeout(() => {
        FlowRouter.go('Users.index');
      }, 1000);
    },
    onError: function(formType, error) {
      console.error(error);
    }
  }
});


