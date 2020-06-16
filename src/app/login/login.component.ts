import { Component, OnInit, OnChanges } from '@angular/core';
import { UsersService } from '../services/users.service';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnChanges {
  loginEmailForm;
  user;
  constructor(public auth: AuthService, private formBuilder: FormBuilder, public route: Router) {
    this.loginEmailForm = this.formBuilder.group({
      email: '',
      password: '',
    });
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

  EmailPasswordSignIn(formVal) {
    this.auth.EmailPasswordSignIn(formVal);
  }
  goToHome() {
    this.route.navigate(['/network']);
  }
  ngOnChanges() {
  this.checkIfUser();

  }
}
