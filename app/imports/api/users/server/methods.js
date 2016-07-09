import '/imports/lib/postgrest/server/collection.js';
import { RestCollection } from '/imports/lib/postgrest/collection.js';
import { Users } from '../users.js';
import { Meteor } from 'meteor/meteor';
import urljoin from 'url-join';
import crypto from 'crypto';

Users._api = Meteor.settings.services.postgrest.url;

Users.hashPassword = function(password, salt) {
  if(!salt) {
    salt = crypto.randomBytes(8);
  }
  let hash = crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
  let combi = "$" + salt.toString("base64") + "$" + hash.toString("base64");
  return combi;
};

// Register new method for verifying passwords
Meteor.methods({
  "users.verify" : function(userId, password) {
    this.unblock();
    let users = Users.read(userId);
    if(users.length !== 1) {
      throw new Meteor.Error(404, "User matching " + userId + " was not found.");
    }
    let user = users[0];

    let storedPassword = user.password;
    let salt = new Buffer(storedPassword.split("$")[1], "base64");
    let hashedPassword = Users.hashPassword(password, salt);

    return hashedPassword == storedPassword;
  }
});

// Override the create method so we can hash the password.
Users.create = function(doc) {
  doc.password = this.hashPassword(doc.password);
  return RestCollection.prototype.create.call(this, doc);
};
Users.update = function(doc) {
  if(!_.isEmpty(doc.password)) {
    doc.password = this.hashPassword(doc.password);
  }
  return RestCollection.prototype.update.call(this, doc);
};

Users.register();
