import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';
import { env } from 'process';

@Component({
  selector: 'app-adminhome',
  templateUrl: './adminhome.component.html',
  styleUrls: ['./adminhome.component.scss']
})
export class AdminhomeComponent implements OnInit {

  loggedIn;

  constructor(@Inject(DOCUMENT) document) {
    if(sessionStorage.getItem('password') == environment.credentials.password){
      this.loggedIn = true;
    }
   }

  logIn(){
    let username = document.getElementById('username') as HTMLInputElement;
    let userVal = username.value;
    let password = document.getElementById('password') as HTMLInputElement;
    let passVal = password.value;

    if(userVal == environment.credentials.username && passVal == environment.credentials.password){
      this.loggedIn = true;
      sessionStorage.setItem('password', environment.credentials.password);
    }
  }

  ngOnInit(): void {
  }

}
