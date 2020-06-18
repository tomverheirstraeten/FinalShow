import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {

  constructor() { }

  getDatabase() {
    return firebase.database();
  }


}
