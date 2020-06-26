import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireDatabase } from "@angular/fire/database";
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  users;

constructor(public afs: AngularFirestore, public db: AngularFireDatabase) {
}

getUsers(){
  return this.afs.collection("users").valueChanges();
}
getUsersStatus(){
  return this.db.list("/status").valueChanges();
}
}
