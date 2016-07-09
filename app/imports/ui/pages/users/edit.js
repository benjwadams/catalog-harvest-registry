import './edit.jade';
import './edit.less';

import { Template } from 'meteor/templating';
import { Users } from '/imports/api/users/users.js';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';


let success = new ReactiveVar(false);
let deleted = new ReactiveVar(false);
let failure = new ReactiveVar(null);

AutoForm.debug();

SimpleSchema.debug = true;
let schema = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: "Email"
  },
  first_name: {
    type: String,
    label: "First Name"
  },
  last_name: {
    type: String,
    label: "Last Name"
  },
  password: {
    type: String,
    min: 6,
    label: "Password"
  },
  passwordConfirmation: {
    type: String,
    min: 6, 
    label: "Confirm Password",
    custom: function() {
      if (this.value != this.field("password").value) {
        return "passwordMismatch";
      }
    }
  }
});

schema.messages({
  passwordMismatch: "Password and Confirmation Password must match."
});

Template.usersEdit.onCreated(function() {
  this.autorun(() => {
    success.set(false);
    deleted.set(false);
    failure.set(null);
    Users.read(FlowRouter.getParam('userId'), (error, response) => {
      if(error) {
        Session.set('user', {error});
      } else if (response.length == 1) {
        Session.set('user', response[0]);
      } else {
        Session.set('user', {error: "Not Found"});
      }
    });
  });
});

Template.usersEdit.helpers({
  formSchema() {
    return schema;
  },
  user() {
    return Session.get('user');
  },
  deleted() {
    return deleted.get();
  },
  success() {
    return success.get();
  }
});

Template.usersEdit.events({
  'click #delete-user'(event) {
    event.preventDefault();
    let userId = Session.get('user').id;
    Users.remove(userId, (error, response) => {
      if(error) {

        failure.set({error});

      } else {

        deleted.set(true);
        Session.set('user', {});

        Meteor.setTimeout(()=> {
          FlowRouter.go('Users.index');
        }, 1000);
      }
    });
  },
  'submit'(event) {
    console.error("What about here");
  }
});

AutoForm.hooks({
  editUser: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();
      let userId = Session.get('user').id;
      let doc = _.omit(insertDoc, "passwordConfirmation");
      console.log(doc);
      doc.id = userId;
      Users.update(doc, (error, response) => {
        if(error) {
          failure.set({error});
          this.done(error);
        } else {
          Session.set('user', doc);
          this.done();
        }
      });
    },
    onSuccess: function(formType, result) {
      success.set(true);
      Meteor.setTimeout(()=> {
        FlowRouter.go('Users.index');
      }, 1000);
    },
    onError: function(formType, error) {
      console.error(error);
    }
  }
});
