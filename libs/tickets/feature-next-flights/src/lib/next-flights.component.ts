import { Component, inject } from '@angular/core';
import { NextFlightsService } from './next-flights.service';
import { Store } from '@ngrx/store';
import { selectPassengersWithTickets } from '@flight-demo/tickets/domain';

@Component({
  selector: 'app-next-flights',
  templateUrl: './next-flights.component.html',
  styleUrls: ['./next-flights.component.css'],
})
export class NextFlightsComponent {
  nextFlightsService = inject(NextFlightsService);
  flights$ = this.nextFlightsService.load();

  store = inject(Store);
  passengers = this.store.select(selectPassengersWithTickets);
}
