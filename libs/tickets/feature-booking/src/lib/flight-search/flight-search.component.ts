import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CityPipe } from '@flight-demo/shared/ui-common';
import { ticketsActions, ticketsFeature } from '@flight-demo/tickets/domain';
import { Store } from '@ngrx/store';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, CityPipe, FlightCardComponent],
})
export class FlightSearchComponent {
  private store = inject(Store);

  from = signal('London');
  to = signal('New York');
  lazyFrom$ = toObservable(this.from).pipe(
    debounceTime(1_000)
  );
  lazyFrom = toSignal(this.lazyFrom$, {
    initialValue: this.from()
  });
  flightRoute = computed(
    () => 'From ' + this.lazyFrom() + ' to ' + this.to() + '.'
  );
  protected flights = this.store.selectSignal(ticketsFeature.selectFlights);

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  constructor() {
    effect(
      () => console.log(this.flightRoute())
    );
  }

  search(): void {
    if (!this.from() || !this.to()) {
      return;
    }

    this.store.dispatch(
      ticketsActions.flightsLoad({
        from: this.from(),
        to: this.to()
      })
    );
  }
}
