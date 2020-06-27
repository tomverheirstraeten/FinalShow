import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit, OnDestroy {

  currentUid;
  currentUser;

  subscription;

  constructor(private route: ActivatedRoute, private as: AdminService) { }

  ngOnDestroy() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.subscription = this.route.paramMap.subscribe(params => {
      this.currentUid = params.get('id'); // get the name from the url
      this.as.getUserByID(this.currentUid).subscribe(user => {
        this.currentUser = user;
      })
    });
  }

}