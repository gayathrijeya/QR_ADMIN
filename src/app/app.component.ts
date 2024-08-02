import { Component } from '@angular/core';
import { LogoutService } from './account/login/logout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'velzon';

  constructor(private logoutService: LogoutService) {}

  ngOnInit(): void {
    this.logoutService.startIdleTimer();
  }
}
