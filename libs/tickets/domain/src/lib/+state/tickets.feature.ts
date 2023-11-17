
import { createActionGroup, createFeature, createReducer, createSelector, emptyProps, on, props, provideState } from "@ngrx/store";
import { Flight } from "../entities/flight";
import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import { FlightTicket } from "../entities/flight-ticket";
import { Passenger } from "../entities/passenger";

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

export function provideTicketsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(ticketsFeature)
  ]);
}
