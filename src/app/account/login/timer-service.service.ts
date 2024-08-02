import { Injectable } from '@angular/core';
import { Subject, Observable, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TimerServiceService {

  private timer!: Observable<number>;
  private stopTimer$ = new Subject<void>();

  constructor() {
    this.startTimer();
  }

  private startTimer(): void {
    this.timer = timer(0, 1000);
    this.timer.pipe(
      takeUntil(this.stopTimer$)
    ).subscribe();
  }

  resetTimer(): void {
    this.stopTimer$.next();
    this.startTimer();
  }

  stopTimer(): void {
    this.stopTimer$.next();
  }

  getTimer(): Observable<number> {
    return this.timer;
  }
}