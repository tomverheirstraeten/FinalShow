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
  UsersService
} from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnChanges {
  user;
  registerEmailForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    website: new FormControl(''),
    functie: new FormControl('', [Validators.required]),
    bio: new FormControl(''),
    gdpr: new FormControl('', [Validators.required])
  });
  registerGoogleForm = new FormGroup({
    website: new FormControl(''),
    functie: new FormControl('', [Validators.required]),
    bio: new FormControl(''),
    gdpr: new FormControl('', [Validators.required])
  });
  GoogleHidden = true;
  constructor(public auth: AuthService,
              public userService: UsersService,
              private formBuilder: FormBuilder,
              public route: Router) {


  }

  ngOnInit() {
    this.checkIfUser();
  }



  async checkIfUser() {
    this.user = await this.auth.getUser();
    if (this.user) {


      this.goToHome();
    }
  }

  goToHome() {
    this.route.navigate(['/network']);
  }
  EmailPasswordRegister(formVal) {
    if (this.registerEmailForm.valid) {
      this.auth.EmailPasswordRegister(formVal);
    }
  }

  GoogleRegister(formVal) {
    console.log(this.registerGoogleForm);
    if (this.registerGoogleForm.valid) {
      this.auth.googleSignUp(formVal);
    }
  }
  ngOnChanges() {
    if (this.auth.userId) {
      this.goToHome();
    }

  }

  ToggleForm() {
    this.GoogleHidden = !this.GoogleHidden;
  }
}
