import { RestCollection } from '../collection.js';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import querystring from 'querystring';
import urljoin from 'url-join';

RestCollection.prototype.create = function(doc) {
  let apiURL = urljoin(this._api, this._tableName);
  let response = Meteor.wrapAsync((apiURL, callback) => {
    let errorCode;
    let errorMessage;
    let myError;
    try {
      let response = HTTP.post(apiURL, {data: doc});
      callback(null, doc);
    } catch (error) {
      if(error.response) {
        errorCode = error.response.data.code;
        errorMessage = error.response.data.message;
      } else {
        errorCode = 500;
        errorMessage = "Cannot Access API";
      }
      myError = new Meteor.Error(errorCode, errorMessage);
      callback(myError, null);
    }
  })(apiURL);
  return response;
};

RestCollection.prototype.read = function(docId) {
  let apiURL = urljoin(this._api, this._tableName);
  console.log(this._collectionName, "read");

  // If this is fetching a single document.
  if(docId) {
    apiURL += "?" + querystring.stringify({id: "eq." + docId});
  }

  let response = Meteor.wrapAsync((apiURL, callback) => {
    let errorCode;
    let errorMessage;
    let myError;
    try {

      // Get the data and call the callback with the response;
      let response = HTTP.get(apiURL).data;
      callback(null, response);
    } catch (error) {
      if(error.response) {
        errorCode = error.response.data.code;
        errorMessage = error.response.data.message;
      } else {
        errorCode = 500;
        errorMessage = "Cannot Access API";
      }
      myError = new Meteor.Error(errorCode, errorMessage);
      callback(myError, null);

    }
  })(apiURL);
  return response;
};

RestCollection.prototype.update = function(doc) {
  let apiURL = urljoin(this._api, this._tableName);
  apiURL += "?" + querystring.stringify({id: "eq." + doc.id});

  let response = Meteor.wrapAsync((apiURL, callback) => {
    let errorCode;
    let errorMessage;
    let myError;
    try {
      let response = HTTP.patch(apiURL, {data: doc});
      callback(null, doc);
    } catch (error) {
      if(error.response) {
        errorCode = error.response.data.code;
        errorMessage = error.response.data.message;
      } else {
        errorCode = 500;
        errorMessage = "Cannot Access API";
      }
      myError = new Meteor.Error(errorCode, errorMessage);
      callback(myError, null);
    }
  })(apiURL);
  return response;
};

RestCollection.prototype.remove = function(docId) {
  let apiURL = urljoin(this._api, this._tableName);
  apiURL += "?" + querystring.stringify({id: "eq." + docId});

  let response = Meteor.wrapAsync((apiURL, callback) => {
    let errorCode;
    let errorMessage;
    let myError;
    try {
      let response = HTTP.del(apiURL);
      callback(null, {});
    } catch (error) {
      if(error.response) {
        errorCode = error.response.data.code;
        errorMessage = error.response.data.message;
      } else {
        errorCode = 500;
        errorMessage = "Cannot Access API";
      }
      myError = new Meteor.Error(errorCode, errorMessage);
      callback(myError, null);
    }
  })(apiURL);
  return response;
};

RestCollection.prototype.register = function() {
  var self = this;
  let methods = {};

  methods[this._collectionName + ".create"] = function(doc) {
    this.unblock();
    return self.create(doc);
  };
  methods[this._collectionName + ".read"] = function(docId) {
    // On the server, this will allow the N+1th invocation of this method to
    // run in a new fiber. This allows the proxying to be asynchronous.
    this.unblock(); // this points to Meteor
    return self.read(docId);
  };

  methods[this._collectionName + '.update'] = function(doc) {
    this.unblock();
    return self.update(doc);
  };

  methods[this._collectionName + '.remove'] = function(docId) {
    this.unblock();
    return self.remove(docId);

  };

  Meteor.methods(methods);
};
