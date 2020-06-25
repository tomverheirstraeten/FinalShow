import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy
} from '@angular/core';

import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  Router, ActivatedRoute
} from '@angular/router';
import {
  AuthService
} from 'src/app/services/auth.service';
import {
  RoomsService
} from 'src/app/services/rooms.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from "rxjs";
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnChanges, OnDestroy{
  componentDestroyed$ : Subject<boolean> = new Subject();
  user;
  errorMessages;
  id;
  routeSub;
  loginEmailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
  constructor(private afAuth: AngularFireAuth, public auth: AuthService, private formBuilder: FormBuilder, public router: ActivatedRoute,public route: Router , public rooms: RoomsService) {

  }






  ngOnInit() {
    this.routeSub = this.router.params.subscribe(params => {
      if(params.id && params.id !== undefined){
        this.id = params.id;
      }
    });
    this.checkIfUser();
  }
  ngOnDestroy() {
    if (this.routeSub !== undefined) {
      this.routeSub.unsubscribe();
    }
    if (this.user !== undefined) {
      this.user.unsubscribe();
    }

  }


  private async checkIfUser() {
    this.user = await this.auth.getUser();
    if (this.user) {
      if (this.id === 'livestream') {
        this.goToLivestream();
      } else {
        this.goToHome();
      }
    }
  }

      // Email & password sign in
   async EmailPasswordSignIn(formVal) {
    if (this.loginEmailForm.valid) {
      let errorMessage;
      const credentials = await this.afAuth.signInWithEmailAndPassword(formVal.email, formVal.password).catch((error) => {
            const errorCode = error.code;
            errorMessage = error.message;
          });
      this.errorMessages = errorMessage;
      if (!this.errorMessages) {
        if (this.id === 'livestream') {
          this.goToLivestream();
        } else {
          return this.route.navigate(['/network']);
        }
      }
      }

    }

  goToHome() {
    this.route.navigate(['/network']);
  }
  goToLivestream() {
    this.route.navigate(['/livestream']);
  }
  ngOnChanges() {
    this.checkIfUser();
  }
}
