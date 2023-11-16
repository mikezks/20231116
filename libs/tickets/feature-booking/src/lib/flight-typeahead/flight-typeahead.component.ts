import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, delay, of, share, tap, timer } from 'rxjs';

@Component({
  selector: 'tickets-flight-typeahead',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-typeahead.component.html',
  styleUrls: ['./flight-typeahead.component.css'],
})
export class FlightTypeaheadComponent implements OnDestroy {
  timer$ = timer(0, 1_000).pipe(
    tap(value => console.log('Value produce', value)),
    // share()
  );
  subscription = new Subscription();

  constructor() {
    this.subscription.add(
      of('Hello RxJS').pipe(
        delay(3_000)
      ).subscribe(value => console.log(value))
    );

    this.subscription.add(
      this.timer$.subscribe(console.log)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
