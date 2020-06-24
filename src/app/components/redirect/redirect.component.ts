import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit {
  useragent = navigator.userAgent;
  constructor(private router: Router) { }

  ngOnInit(): void {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(this.useragent)) {
      this.router.navigate(["/mobileLanding"])
    }


    else if (/Chrome/i.test(this.useragent)) {
      this.router.navigate(["/desktopLanding"])
    }


    else {
      this.router.navigate(["/desktopLanding"])
    }

  }

}
