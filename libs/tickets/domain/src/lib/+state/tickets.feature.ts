
import { createActionGroup, createFeature, createReducer, createSelector, emptyProps, on, props, provideState } from "@ngrx/store";
import { Actions, createEffect, ofType, provideEffects } from "@ngrx/effects";
import { Flight } from "../entities/flight";
import { EnvironmentProviders, Injectable, inject, makeEnvironmentProviders } from "@angular/core";
import { FlightTicket } from "../entities/flight-ticket";
import { Passenger } from "../entities/passenger";
import { FlightService } from "../infrastructure/flight.service";
import { map, switchMap } from "rxjs";

// Just store ticketIds instead of tickets
export type PassengerState = Omit<Passenger, 'tickets'> & {
  ticketIds: number[];
};

// Store passengerId and flightId instead of passenger and flight
export type FlightTicketState = Omit<FlightTicket, 'passenger' | 'flight'> & {
  passengerId: number;
  flightId: number;
};

export interface TicketsState {
  flights: Flight[];
  basket: unknown;
  tickets: unknown;
  hide: number[];

  passengers: Record<number, PassengerState>;
  passengerIds: number[];

  flightTickets: Record<number, FlightTicketState>;
  flightTicketIds: number[];
}

export const initialTicketsState: TicketsState = {
  flights: [],
  basket: {},
  tickets: {},
  hide: [1241, 1292, 1294],

  passengers: {
    17: { id: 17, firstName: 'John', lastName: 'Doe', ticketIds: [107, 109] },
    24: { id: 24, firstName: 'Jane', lastName: 'Doe', ticketIds: [108, 110] },
  },
  passengerIds: [17, 24],

  flightTickets: {
    107: { id: 107, flightId: 1, passengerId: 17, price: 317 },
    108: { id: 108, flightId: 1, passengerId: 24, price: 317 },
    109: { id: 109, flightId: 2, passengerId: 17, price: 294 },
    110: { id: 110, flightId: 2, passengerId: 24, price: 294 },
  },
  flightTicketIds: [107, 108, 109, 110]
};

export const ticketsActions = createActionGroup({
  source: 'tickets',
  events: {
    'flights load': props<{ from: string; to: string }>(),
    'flights loaded': props<{ flights: Flight[] }>(),
    'flight update': props<{ flight: Flight }>(),
    'clear flights': emptyProps,
  }
});

export const ticketsFeature = createFeature({
  name: 'tickets',
  reducer: createReducer(
    initialTicketsState,

    on(ticketsActions.flightsLoaded, (state, action) => ({
      ...state,
      flights: action.flights
    }))
  )
});

export const selectFlightsActive = createSelector(
  ticketsFeature.selectFlights,
  ticketsFeature.selectHide,
  (flights, hide) => flights.filter(
    flight => !hide.includes(flight.id)
  )
);

export const selectPassengersWithTickets = createSelector(
  ticketsFeature.selectPassengerIds,
  ticketsFeature.selectPassengers,
  ticketsFeature.selectFlightTickets,
  (ids, passengers, tickets) =>
    ids.map((id) => {
      const passenger = passengers[id];
      const ticketList = passenger.ticketIds.map((id) => tickets[id]);
      return { ...passenger, tickets: ticketList } as Passenger;
    })
);

@Injectable({
  providedIn: 'root'
})
export class TicketsEffect {
  private actions$ = inject(Actions);
  private flightService = inject(FlightService);

  loadFlights$ = createEffect(
    /**
     * Stream 1: Store Actions
     *  - Trigger
     *  - State Provider: from, to
     */
    () => this.actions$.pipe(
      // Filtering: Flights load
      ofType(ticketsActions.flightsLoad),
      /**
       * Stream 2: Backend API Call
       *  - State Provider: Flights
       */
      switchMap(action => this.flightService.find(
        action.from,
        action.to
      )),
      // Transformation: Flights -> Action Flights loaded
      map(flights => ticketsActions.flightsLoaded({ flights }))
    )
  );
}

export function provideTicketsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(ticketsFeature),
    provideEffects([TicketsEffect])
  ]);
}
