import {
  Injectable
} from '@angular/core';
import {
  AngularFirestore
} from '@angular/fire/firestore';
import {
  AuthService
} from './auth.service';
import {
  Router
} from '@angular/router';
import {
  firestore
} from 'firebase/app';
import {
  map,
  switchMap
} from 'rxjs/operators';
import {
  Observable,
  combineLatest,
  of
} from 'rxjs';
import {
  UsersService
} from './users.service';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  allChats: Observable < any > ;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private router: Router,
    private userService: UsersService
  ) {

  }

  get(chatId) {
    return this.afs
      .collection < any > ('chats')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return {
            id: doc.payload.id,
            ...doc.payload.data() as Object
          };
        })
      );
  }

  getAllChats() {
    return this.afs.collection < any > ('chats')
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {
              id,
              ...data
            };
          });
        })
      );
  }
  getUniqueChats(chatId) {
    return this.afs.collection < any > ('chats/').doc(chatId).valueChanges();

  }




  async create(uid2) {
    const {
      uid,
      displayName
    } = await this.auth.getUser();
    const data = {
      roomName: 'Room',
      uid,
      uid2,
      displayName,
      createdAt: Date.now(),
      count: 0,
      messages: []
    };

    if (uid === uid2) {
      // return false;
    } else {
      const docRef = await this.afs.collection('chats').add(data);
      return this.router.navigate(['chats', docRef.id]);
    }
  }




  async sendMessage(chatId, content) {
    const {
      uid
    } = await this.auth.getUser();

    const data = {
      uid,
      content,
      createdAt: Date.now(),
      deleted: false,
      seen: false
    };

    if (uid) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }

  async sendMessageHand(chatId) {
    const {
      uid
    } = await this.auth.getUser();
    const data = {
      uid,
      content: '',
      createdAt: Date.now(),
      deleted: false,
      hand: true,
      seen: false
    };

    if (uid) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }

  async deleteMessage(chat, msg) {
    const {
      uid
    } = await this.auth.getUser();

    const ref = this.afs.collection('chats').doc(chat.id);

    if (chat.uid === uid || msg.uid === uid) {
      // Allowed to delete
      delete msg.user;
      return ref.update({
        messages: firestore.FieldValue.arrayRemove(msg)
      });
    }
  }


  async updateMessage(chat, msg, i) {
    const {
      uid
    } = await this.auth.getUser();
    const ref = this.afs.collection('chats').doc(chat.id);
    if (chat.uid === uid || msg.uid === uid) {
      let allMessages;
      this.get(chat.id).subscribe(res => {
        allMessages = res['messages'],
          allMessages[i].originalContent = allMessages[i].content;
        allMessages[i].content = 'Dit bericht werd verwijderd';
        allMessages[i].deleted = true;
        return ref.update({
          messages: allMessages
        });
      });
    }
  }

  async updateMessageSeen(chat) {
    const {
      uid
    } = await this.auth.getUser();

    const ref = this.afs.collection('chats').doc(chat.id);

    if (chat.uid === uid || chat.uid2 === uid) {
      let allMessages;

    this.get(chat.id).subscribe(res => {
        allMessages = res['messages'];

        for (const message of allMessages) {
          if (uid !== message.uid) {
            message.seen = true;
          }
        }

        return ref.update({
          messages: allMessages
        });
      });
    }
  }


  async updateMessageSeenConversation(chatId) {
    const {
      uid
    } = await this.auth.getUser();

    const ref = this.afs.collection('chats').doc(chatId);



    this.get(chatId).subscribe(res => {
      let allMessages;

      allMessages = res['messages'];
      if (res['uid'] === uid || res['uid2'] === uid) {
        for (const message of allMessages) {
          if (uid !== message.uid) {
            message.seen = true;
          }
        }
      }
      return ref.update({
        messages: allMessages
      });
    });

  }

  joinUsers(chat$: Observable < any > ) {
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

        return userDocs.length ? combineLatest(userDocs) : of ([]);
      }),
      map(arr => {
        arr.forEach(v => {
          if (v !== undefined) {
            (joinKeys[( <any> v).uid ] = v);
          }

        });
        chat.messages = chat.messages.map(v => {
          return {
            ...v,
            user: joinKeys[v.uid]
          };
        });

        return chat;
      })
    );
  }
}
