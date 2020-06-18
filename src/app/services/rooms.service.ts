import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { firestore } from 'firebase/app';
import { map, switchMap } from 'rxjs/operators';
import { Observable, combineLatest, of } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  rooms: Observable<any>;
  roomCollection:any;
  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router
  ) {

  }

  get(chatId) {
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



  async create() {
    const { uid } = await this.auth.getUser();
    const data = {
      roomName: 'Room',
      uid,
      createdAt: Date.now(),
      count: 0,
      messages: []
    };

    const docRef = await this.afs.collection('rooms').add(data);

    return this.router.navigate(['rooms', docRef.id]);
  }



  getRooms() {
    return  this.rooms =  this.afs.collection<any>('rooms')
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


  async sendMessage(chatId, content) {
    const { uid } = await this.auth.getUser();

    const data = {
      uid,
      content,
      createdAt: Date.now(),
      deleted: false
    };

    if (uid) {
      const ref = this.afs.collection('rooms').doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }

  async deleteMessage(chat, msg) {
    const { uid } = await this.auth.getUser();

    const ref = this.afs.collection('rooms').doc(chat.id);
    console.log(msg);
    if (chat.uid === uid || msg.uid === uid) {
      // Allowed to delete
      delete msg.user;
      return ref.update({
        messages: firestore.FieldValue.arrayRemove(msg)
      });
    }
  }

  joinUsers(chat$: Observable<any>) {
    let chat;
    const joinKeys = {};

    return chat$.pipe(
      switchMap(c => {
        // Unique User IDs
        chat = c;
        const uids = Array.from(new Set(c.messages.map(v => v.uid)));

        // Firestore User Doc Reads
        const userDocs = uids.map(u =>
          this.afs.doc(`users/${u}`).valueChanges()
        );

        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        arr.forEach(v => (joinKeys[(<any>v).uid] = v));
        chat.messages = chat.messages.map(v => {
          return { ...v, user: joinKeys[v.uid] };
        });

        return chat;
      })
    );
  }
}
