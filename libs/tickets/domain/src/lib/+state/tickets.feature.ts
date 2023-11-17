
import { createActionGroup, createFeature, createReducer, emptyProps, on, props, provideState } from "@ngrx/store";
import { Flight } from "../entities/flight";
import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";

export interface TicketsState {
  flights: Flight[];
  basket: unknown;
  tickets: unknown;
}

export const initialTicketsState: TicketsState = {
  flights: [],
  basket: {},
  tickets: {}
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

export function provideTicketsFeature(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState(ticketsFeature)
  ]);
}
