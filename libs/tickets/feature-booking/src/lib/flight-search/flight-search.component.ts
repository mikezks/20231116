import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { CityPipe } from '@flight-demo/shared/ui-common';
import { Flight, FlightService, selectFlightsActive, ticketsActions, ticketsFeature } from '@flight-demo/tickets/domain';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, CityPipe, FlightCardComponent],
})
export class FlightSearchComponent {
  private store = inject(Store);

  from = 'London';
  to = 'New York';
  protected flights$ = this.store.select(selectFlightsActive);

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  private flightService = inject(FlightService);

  search(): void {
    if (!this.from || !this.to) {
      return;
    }

    this.flightService.find(this.from, this.to).subscribe({
      next: (flights) => {
        this.store.dispatch(
          ticketsActions.flightsLoaded({ flights })
        );
      },
      error: (errResp) => {
        console.error('Error loading flights', errResp);
      },
    });
  }
}
