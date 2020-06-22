import {
  Component,
  OnInit,
  OnChanges
} from '@angular/core';

import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  Router
} from '@angular/router';
import {
  AuthService
} from 'src/app/services/auth.service';
import {
  RoomsService
} from 'src/app/services/rooms.service';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnChanges {
  user;
  errorMessages;
  loginEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
  constructor(private afAuth: AngularFireAuth, public auth: AuthService, private formBuilder: FormBuilder, public route: Router, public rooms: RoomsService) {

  }






  ngOnInit() {
    this.checkIfUser();
  }



  private async checkIfUser() {
    this.user = await this.auth.getUser();
    if (this.user) {
      this.goToHome();
    }
  }

      // Email & password sign in
   async EmailPasswordSignIn(formVal) {
    if(this.loginEmailForm.valid){
      let errorMessage;
      const credentials = await this.afAuth.signInWithEmailAndPassword(formVal.email, formVal.password).catch((error) => {
            const errorCode = error.code;
            errorMessage = error.message;
          });
      this.errorMessages = errorMessage;
      if (!this.errorMessages) {
        return this.route.navigate(['/network']);
      }
      }

    }

  goToHome() {
    this.route.navigate(['/network']);
  }
  ngOnChanges() {
    this.checkIfUser();

  }
}
