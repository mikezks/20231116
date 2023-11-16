import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Flight, FlightService } from '@flight-demo/tickets/domain';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, filter, of, switchMap, takeUntil, tap, timer } from 'rxjs';

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
export class FlightTypeaheadComponent /* implements OnDestroy  */{
  private flightService = inject(FlightService);

  protected control = new FormControl('', { nonNullable: true });
  protected flights$ = this.initFlightsStream();
  protected loading = false;

  private destroy$ = new Subject<void>();
  private takeUntilDestroyed = takeUntilDestroyed;

  constructor() {
    timer(0, 1_000).pipe(
      // takeUntil(this.destroy$),
      this.takeUntilDestroyed()
    ).subscribe(console.log);
  }

  initFlightsStream(): Observable<Flight[]> {
    /**
     * Stream 1: RX Form Control - Value Changes
     *  - Trigger
     *  - State Provider: Filter
     */
    return this.control.valueChanges.pipe(
      // Filtering START
      filter(city => city.length > 2),
      debounceTime(300),
      distinctUntilChanged(),
      // Filtering END
      // Side-Effect: Set Loading Prop
      tap(() => this.loading = true),
      /**
       * Stream 2: Flight Data Access Service - Backend API Call: Array of Flights
       *  - State Provider: Final View State
       */
      switchMap(city => this.flightService.find(city, '').pipe(
        // Error Handling: Fallback Stream - Empty Array
        catchError(() => of([]))
      )),
      // Side-Effect: Set Loading Prop
      tap(() => this.loading = false)
    );
  }

  /* ngOnDestroy(): void {
    this.destroy$.next();
  } */
}
