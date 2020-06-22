import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
@Input() back: string;
toggleInbox = true;
  constructor(private _location: Location) { }

  ngOnInit(): void {

  }

  goBack(){
    this._location.back();
  }


}
