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
    this.db.collection('timetable').orderBy('time').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.data.push(doc.data());
      });
    });
    return this.data;
  }

  getEventByName(name: string) {
    this.data = new Array();
    this.db.collection('timetable').where('name', '==', name).get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        this.data.push(doc.data());
      });
    });
    return this.data;
  }

  displayTime(time){
    let date = new Date(time.seconds * 1000);
    let hours = date.getHours();
    let hourString: string;
    if(hours < 10) {
      hourString = '0' + hours.toString();
    } else {
      hourString = hours.toString();
    }

    let minutes = date.getMinutes();
    let minuteString: string;
    if(minutes < 10) {
      minuteString = '0' + minutes.toString();
    } else {
      minuteString = minutes.toString();
    }

    return hourString + ':' + minuteString;

  }
}
