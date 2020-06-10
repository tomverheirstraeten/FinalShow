import { Injectable } from '@angular/core';

declare var require: any;

const firebase = require('firebase');
// Required for side-effects
require('firebase/firestore');

const credentials = {
  apiKey: 'AIzaSyABvAb09DZzUPPNXyQNuk0-tDaRdoOAqzs',
  projectId: 'finalshow',
  authDomain: 'finalshow.firebaseapp.com'

}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  db;
  data: Array<object>;

  constructor() {
    firebase.initializeApp({
      apiKey: credentials.apiKey,
      authDomain: credentials.authDomain,
      projectId: credentials.projectId
    });
    this.db = firebase.firestore();
   }

   getTimetable() {
    this.data = new Array();
    this.db.collection('timetable').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.data.push(doc.data());
      });
    });
    return this.data;
   }
}
