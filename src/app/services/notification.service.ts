import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private afs: AngularFirestore) { }

  getNotifiation() {
    return this.afs.collection<any>('notifications')
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
}
