import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import { AngularFireDatabase } from "@angular/fire/database";
import * as firebase from 'firebase/app';
import {AngularFireAuth} from '@angular/fire/auth';

import{ tap, map, switchMap, first} from 'rxjs/operators';
import {of, Subscription} from'rxjs';
import {Observable} from 'rxjs';
import {AngularFirestore, AngularFirestoreDocument} from '@angular/fire/firestore';
import { getParseErrors } from '@angular/compiler';
import { isError } from 'util';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable < any > ;
  userId;
  userEmail: String = '';
  userDisplayName: String = '';
  userPhotoURL: String = '';
  error: Observable < any > ;
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router, private db: AngularFireDatabase) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          this.userId = user.uid;
          this.userEmail = user.email;
          this.userDisplayName = user.displayName;
          this.userPhotoURL = user.photoURL;
          // this.updateOnUser().subscribe();
          // this.updateOnDisconnect().subscribe();
          // this.updateOnAway();
          return this.afs.doc <any> (`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
          this.updateOnUser().subscribe();
          this.updateOnDisconnect().subscribe();
          this.updateOnAway();
  }

  // !=============CHECKSTATUS============= //
  getPresence(uid: String) {
    return this.db.object(`status/${uid}`).valueChanges();
  }

  async setPresence(status: String) {
    const user = await this.getUser();
    if (user) {
      return this.db.object(`status/${user.uid}`).update({status, timestamp: this.timestamp,  uid: user.uid,  name: user.displayName});
    }
  }
  getUser() {
    return this.user$.pipe(first()).toPromise();
  }

  get timestamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }


updateOnUser() {
  const connection = this.db.object('.info/connected').valueChanges().pipe(
    map(connected => connected ? 'online' : 'offline')
  );
  return this.afAuth.authState.pipe(
    switchMap(user => user ? connection : of('offline')),
    tap(status => this.setPresence(status))
  );
}



updateOnAway() {
  document.onvisibilitychange = (e) => {
    if (document.visibilityState === 'hidden') {
      this.setPresence('away');
    } else {
      this.setPresence('online');
    }
  };
}

updateOnDisconnect() {
return this.afAuth.authState.pipe(
  tap(user => {
    if(user) {
      this.db.object(`status/${user.uid}`).query.ref.onDisconnect().update({status: 'offline', timestamp: this.timestamp});
    }
  })
);
}
















  // !=============SIGNIN============= //

  // Google signin
  googleSignIn(id) {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider, id);
  }

  private async oAuthLogin(provider, id) {
    const credential = await this.afAuth.signInWithPopup(provider);
    this.getUser().then(user => {

      if (user === undefined) {
        if (id === 'livestream') {
          this.updateUserDataGoogleSignIn(credential.user, id);

        } else{
          this.updateUserDataGoogleSignIn(credential.user, id);

        }
      } else {
        if (id === 'livestream') {
          return this.router.navigate(['/livestream']);
        } else {
          return this.router.navigate(['/network']);
        }
      }
    });
  }

  private updateUserDataGoogleSignIn({
    uid,
    email,
    displayName,
    photoURL,
  }, id) {
    const userRef: AngularFirestoreDocument < any > = this.afs.doc(`users/${uid}`);

    const data = {
      uid,
      email,
      displayName,
      photoURL,
      website: '',
      function: '',
      bio: '',
      admin: false,
      gdpr: '',
      character: 'character2'
    };

    userRef.set(data, {
      merge: true
    });
    if (id === 'livestream') {
      return this.router.navigate(['/google-register', id]);
    } else {
      return this.router.navigate(['/google-register']);
    }
  }
  // !=============REGISTER============= //
   // Google register
   googleSignUp(formVal, id, character) {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthRegister(provider,formVal, id, character);

  }

  private async oAuthRegister(provider, formVal, id, character) {
    const credential = await this.afAuth.signInWithPopup(provider);
    return this.updateUserDataGoogle(credential.user, formVal, id, character);
  }

  private updateUserDataGoogle({
    uid,
    email,
    displayName,
    photoURL,
  }, formVal, id, character) {
    const userRef: AngularFirestoreDocument < any > = this.afs.doc(`users/${uid}`);

    const data = {
      uid,
      email,
      displayName,
      photoURL,
      website: formVal.website,
      function: formVal.functie,
      bio: formVal.bio,
      admin: false,
      gdpr: formVal.gdpr,
      character
    };

    userRef.set(data, {
      merge: true
    });
    if (id === 'livestream') {
      return this.router.navigate(['/livestream']);
    } else {
      return this.router.navigate(['/network']);
    }
  }

  // Email & password register
  async EmailPasswordRegister(formVal, id, character) {

    const credentials = await this.afAuth.createUserWithEmailAndPassword(formVal.email, formVal.password);

    try {
      return this.updateUserDataEmail(credentials,formVal, id, character);
    } catch (error) {
      console.log(error);
    }

  }

      // Update user data with email
  private updateUserDataEmail(credentials, formVal, id, character) {
    const userRef: AngularFirestoreDocument < any > = this.afs.doc(`users/${credentials.user.uid}`);
    const data = {
      uid: credentials.user.uid,
      email: formVal.email,
      displayName: formVal.name,
      function: formVal.functie,
      website: formVal.website,
      bio: formVal.bio,
      admin: false,
      gdpr: formVal.gdpr,
      character
    };

    userRef.set(data, {
      merge: true
    });
    if(id === 'livestream'){
      return  this.router.navigate(['/livestream']);
    }else{
      return this.router.navigate(['/network']);
    }

  }






    // Anonymous sign in
    async AnonymousSignIn(userName) {
      const credentials = await this.afAuth.signInAnonymously();
      return this.updateUserData(credentials, userName);
    }

    // Update user data
    private updateUserData(credentials, username) {
      const userRef: AngularFirestoreDocument < any > = this.afs.doc(`users/${credentials.user.uid}`);
      const data = {
        uid: credentials.user.uid,
        displayName: username,
      };

      return userRef.set(data, {
        merge: true
      });
    }













// ! UPDATE USER
    // Google Update
    public googleUpdate(formVal, id, character) {
      const userRef: AngularFirestoreDocument < any > = this.afs.doc(`users/${this.userId}`);

      const data = {
        uid: this.userId ,
        email:  this.userEmail,
        displayName: this.userDisplayName,
        photoURL: this.userPhotoURL,
        website: formVal.website,
        function: formVal.functie,
        bio: formVal.bio,
        admin: false,
        gdpr: formVal.gdpr,
        character
      };

      userRef.set(data, {
        merge: true
      });
      if (id === 'livestream') {
        return this.router.navigate(['/livestream']);
      } else {
        return this.router.navigate(['/network']);
      }
    }
  // profile Update
  public updateProfile(formVal){
    const collection = this.afs.collection('users');
    collection.doc(this.userId).update({
      displayName: formVal.displayName,
      website: formVal.website,
      function: formVal.functie,
      bio: formVal.bio,
      character:  formVal.character,
    });
  }

  async signOut() {
    await this.setPresence('offline');
    await this.afAuth.signOut();
    window.location.reload();
    return this.router.navigate(['/login']);
  }
}
