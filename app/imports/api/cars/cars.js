import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

console.log("Cars loaded");
export const Cars = new Mongo.Collection('Cars');

// Deny all client-side updates since we will be using methods to manage this collection
Cars.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

Cars.schema = new SimpleSchema({
  name: {
    type: String,
    label: "Car Name"
  },
  color: {
    type: String,
    allowedValues: ["red", "green", "blue"],
    label: "Available Colors",
  }
});

// Although there are a variety of ways that you can run data through a Simple
// Schema before sending it to your collection (for instance you could check a
// schema in every method call), the simplest and most reliable is to use the
// aldeed:collection2 package to run every mutator (insert/update/upsert call)
// through the schema.
Cars.attachSchema(Cars.schema);

Cars.publicFields = {
  name: 1,
  color: 1
};

