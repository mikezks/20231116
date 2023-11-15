import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { FlightService, Flight } from '@flight-demo/tickets/domain';
import { interval, startWith, map, distinctUntilChanged, tap, filter, debounceTime, combineLatest, switchMap, Observable } from 'rxjs';

@Component({
  selector: 'tickets-flight-typeahead',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './flight-typeahead.component.html',
  styleUrls: ['./flight-typeahead.component.css'],
})
export class FlightTypeaheadComponent {
  flightService = inject(FlightService);

  loading = false;
  control = new FormControl();

  online = false;
  online$ = interval(2000).pipe(
    startWith(0),
    map((_) => Math.random() < 0.5),
    distinctUntilChanged(),
    tap((value) => (this.online = value))
  );

  input$ = this.control.valueChanges.pipe(
    filter((v) => v.length >= 3),
    debounceTime(300)
  );

  flights$ = combineLatest({
    input: this.input$,
    online: this.online$,
  }).pipe(
    filter((combi) => combi.online),
    tap(() => (this.loading = true)),
    switchMap((combi) => this.load(combi.input)),
    tap(() => (this.loading = false))
  );

  load(airport: string): Observable<Flight[]> {
    return this.flightService.find(airport, '');
  }
}
