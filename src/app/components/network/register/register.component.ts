import {
  Component,
  OnInit,
  OnChanges
} from '@angular/core';

import {
  FormBuilder
} from '@angular/forms';
import {
  Router
} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnChanges{
  user;
  registerEmailForm;
  registerGoogleForm;
  GoogleHidden = true;
  constructor(public auth: AuthService,
    public userService: UsersService,
    private formBuilder: FormBuilder,
    public route: Router) {

    this.registerEmailForm = this.formBuilder.group({
      name: '',
      email: '',
      password: '',
      website: '',
      functie: '',
      bio: ''
    });
    this.registerGoogleForm = this.formBuilder.group({
      website: '',
      functie: '',
      bio: ''
    });
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
    this.auth.EmailPasswordRegister(formVal);
  }

  GoogleRegister(formVal) {
  this.auth.googleSignUp(formVal);
  }
  ngOnChanges() {
    if (this.auth.userId) {
      this.goToHome();
    }

  }

  ToggleForm(){
    this.GoogleHidden = !this.GoogleHidden;
  }
}
