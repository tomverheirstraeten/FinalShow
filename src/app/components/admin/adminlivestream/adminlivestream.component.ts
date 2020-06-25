import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { DOCUMENT } from '@angular/common';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-adminlivestream',
  templateUrl: './adminlivestream.component.html',
  styleUrls: ['./adminlivestream.component.scss']
})
export class AdminlivestreamComponent implements OnInit, OnDestroy {

  currentUrl: string;
  liveStreamUrlSub: Subscription;
  constructor(private service: AdminService, @Inject(DOCUMENT) document, private router: Router) {
    if (sessionStorage.getItem('password') != environment.credentials.password) {
      this.router.navigate(['admin'])
    }
   this.liveStreamUrlSub =  this.service.getStreamUrl().subscribe(data => {
      this.currentUrl = data['url'];
    });
  }
  ngOnDestroy(): void {
    if(this.liveStreamUrlSub !== undefined){
      this.liveStreamUrlSub
    }

  }

  updateUrl(){
    let url = document.getElementById('url') as HTMLInputElement;
    let urlVal = url.value;
    this.service.updateStreamUrl(urlVal);

    url.value = null;
  }

  ngOnInit(): void {
  }

}
