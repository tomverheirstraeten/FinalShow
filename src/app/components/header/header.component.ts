import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() back: string;
  @Input() title: string;
  useragent = navigator.userAgent;

  constructor(private _location: Location, private router: Router) { }

  ngOnInit(): void {

  }

  goBack() {
    this._location.back();
  }

  checkDevice = () => {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(this.useragent)) {
      this.router.navigate(['/rooms'])
    } else if (/Chrome/i.test(this.useragent)) {
      this.router.navigate(['/desktopLanding'])
    } else {
      this.router.navigate(['/desktopLanding'])
    }
  }

}
