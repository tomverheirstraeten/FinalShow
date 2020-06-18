import { Component, OnInit, Input } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {
  @Input() notif;
  constructor(private ns: NotificationService) { }

  ngOnInit() {
  }


}
