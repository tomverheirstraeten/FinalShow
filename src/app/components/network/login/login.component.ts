import { Component, OnInit, OnChanges } from '@angular/core';

import { FormBuilder } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { RoomsService } from 'src/app/services/rooms.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnChanges {
  loginEmailForm;
  user;
  constructor(public auth: AuthService, private formBuilder: FormBuilder, public route: Router, public rooms: RoomsService) {
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
