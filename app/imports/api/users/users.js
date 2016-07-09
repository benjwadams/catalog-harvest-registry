import { RestCollection } from '/imports/lib/postgrest/collection.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Users = new RestCollection(null, "users");

Users.verify = function(userId, password, callback) {
  return Meteor.call("users.verify", userId, password, callback);
};

Users.schema = new SimpleSchema({
  id: {
    type: Number,
  },
  email: {
    type: String
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  password: {
    type: String
  },
  last_login: {
    type: Date
  },
  perms: {
    type: String
  }
});

Users.formFields = [
  "email",
  "first_name",
  "last_name",
  "password"
];

Users.publicFields = {
  id: 1,
  email: 1,
  first_name: 1,
  last_name: 1,
  last_login: 1
};

