import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TimerServiceService } from './timer-service.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
  private idleTime = 600; 
  private idleTimer: any; 

  constructor(private router: Router, private timerService: TimerServiceService) {
    this.initIdleCheck();
  }

  private initIdleCheck(): void {
    document.addEventListener('mousemove', this.resetIdleTimer.bind(this));
    document.addEventListener('keypress', this.resetIdleTimer.bind(this));
  }

  private resetIdleTimer(): void {
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      let getData = localStorage.getItem("Rem");
      localStorage.clear()
      if (getData) {
        localStorage.setItem('Rem', getData)
      }
      this.router.navigate(['/auth/login']);
    }, this.idleTime * 1000);
  }

  startIdleTimer(): void {
    this.resetIdleTimer();
  }
}
