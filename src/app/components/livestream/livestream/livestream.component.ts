import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.scss']
})
export class LivestreamComponent implements OnInit {
liveStreamNotifications = [];
  constructor(private ns:NotificationService) { }

  ngOnInit(): void {
this.getLiveStreamNotifications();
  }

  getLiveStreamNotifications(){
    this.ns.getNotifiation().subscribe(res => {
      res.forEach(notification => {
        if(notification['rooms']){
          notification['rooms'].forEach(room => {
            if(room === 'live stream'){
              this.liveStreamNotifications.push(notification);
            }

          });
        }
      });
      console.log(this.liveStreamNotifications);
    });

  }

}
