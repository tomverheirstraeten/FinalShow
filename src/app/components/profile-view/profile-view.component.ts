import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent implements OnInit {

  currentUid;
  currentUser;

  constructor(private route: ActivatedRoute, private as: AdminService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.currentUid = params.get('id'); // get the name from the url
      this.as.getUserByID(this.currentUid).subscribe(user => {
        this.currentUser = user;
      })
    });
  }

}
