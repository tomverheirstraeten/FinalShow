import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  timetableData: Observable<any>;
  userData: Observable<any>;
  rooms: Observable<any>;

  constructor(private afs: AngularFirestore) { }

  getTimetable() {
    return this.timetableData = this.afs.collection<any>('timetable')
    .snapshotChanges()
    .pipe(
     map(actions => {
       return actions.map(a => {
         const data: Object = a.payload.doc.data();
         const id = a.payload.doc.id;
         return { id, ...data };
       });
     })
    );
  }

  updateTimetableField(id, time, name, desc){
    const collection = this.afs.collection<any>('timetable');
    const hour = time.split(':')[0];
    const minute = time.split(':')[1];
    collection.doc(id).set({
      time: new Date(2020, 6, 27, hour, minute),
      name: name,
      desc: desc
    });
  }

  addTimetableField(time, name, desc){
    const collection = this.afs.collection('timetable');
    const hour = time.split(':')[0];
    const minute = time.split(':')[1];
    collection.add({
      time: new Date(2020, 6, 27, hour, minute),
      name: name,
      desc: desc,
      img: 'assets/images/titlecard.png',
      icon: 'assets/images/clap.png'
    });
  }

  deleteTimetableField(id){
    const collection = this.afs.collection('timetable');
    collection.doc(id).delete();
  }

  getAllUsers() {
    return this.userData = this.afs.collection<any>('users')
    .snapshotChanges()
    .pipe(
     map(actions => {
       return actions.map(a => {
         const data: Object = a.payload.doc.data();
         const id = a.payload.doc.id;
         return { id, ...data };
       });
     })
    );
  }

  updateUser(uId, newRole, adminBool){
    const collection = this.afs.collection('users');
    collection.doc(uId).update({
      function: newRole,
      admin: adminBool
    });
  }

  deleteUser(uId){
    const collection = this.afs.collection('users');
    collection.doc(uId).delete();
  }

  getRooms() {
    return this.rooms = this.afs.collection<any>('rooms')
    .snapshotChanges()
    .pipe(
     map(actions => {
       return actions.map(a => {
         const data: Object = a.payload.doc.data();
         const id = a.payload.doc.id;
         return { id, ...data };
       });
     })
   );
  }

  deleteChats(uid){
    this.afs.collection('chats', ref => ref
      .where('uid', '==', uid))
      .valueChanges({idField: 'chatId'})
      .subscribe(val => val.forEach(element => {
        this.afs.collection('chats').doc(element['chatId']).delete();
      }));
    this.afs.collection('chats', ref => ref
      .where('uid2', '==', uid))
      .valueChanges({idField: 'chatId'})
      .subscribe(val => val.forEach(element => {
        this.afs.collection('chats').doc(element['chatId']).delete();
      }));
  }

  updateMessages(roomId, newArray){
    const ref = this.afs.collection('rooms').doc(roomId);
    return ref.update({
       messages: newArray
    });
  }

  getRoom(chatId) {
    return this.afs
      .collection<any>('rooms')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return { id: doc.payload.id, ...doc.payload.data() as object};
        })
      );
  }

  createRoom(name){
    const collection = this.afs.collection('rooms');
    collection.add({
      roomName: name,
      messages: new Array(),
      createdAt: Date.now()
    });
  }

  deleteRoom(chatId){
    const collection = this.afs.collection('rooms');
    collection.doc(chatId).delete();
  }

  getUsers(messages){
    let newArray = messages;
    newArray.forEach(message => {
      this.afs.collection('users').doc(message['uid']).valueChanges().subscribe(val => message.user = val);
    });
    return newArray;
  }

  sendNotification(messageText, colorCode, selectedRooms, permanentMessage, iconString){
    const collection = this.afs.collection('notifications');
    collection.add({
      created_at: new Date(),
      message: messageText,
      color: colorCode,
      rooms: selectedRooms,
      permanent: permanentMessage,
      icon: iconString
    });
  }

  deleteNotification(id){
    const collection = this.afs.collection('notifications');
    collection.doc(id).delete();
  }

  getPermanentNotifications(){
    return this.afs.collection<any>('notifications', ref => ref
      .where('permanent', '==', true))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  getStreamUrl(){
    return this.afs
    .collection<any>('stream')
    .doc('0')
    .snapshotChanges()
    .pipe(
      map(doc => {
        return { id: doc.payload.id, ...doc.payload.data() as object};
      })
    );
  }

  getChat(uid){
    return this.afs
    .collection<any>('chats')
    .doc(uid)
    .snapshotChanges()
    .pipe(
      map(doc => {
        return { id: doc.payload.id, ...doc.payload.data() as object};
      })
    );
  }

  getUserByID(uid){
    return this.afs
    .collection<any>('users')
    .doc(uid)
    .snapshotChanges()
    .pipe(
      map(doc => {
        return { id: doc.payload.id, ...doc.payload.data() as object};
      })
    );
  }

  getEventByName(name: string) {
    return this.afs.collection<any>('timetable', ref => ref
      .where('name', '==', name))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data: Object = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }

  updateStreamUrl(url){
    return this.afs
    .collection<any>('stream')
    .doc('0')
    .update({
      url: url
    })
  }

}
