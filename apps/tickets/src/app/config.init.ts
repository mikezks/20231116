import { HttpClient } from "@angular/common/http";
import { APP_INITIALIZER, EnvironmentProviders, Injectable, inject, makeEnvironmentProviders } from "@angular/core";
import { BehaviorSubject, Observable, delay, tap } from "rxjs";

export interface InitConfig {
  serviceUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class InitConfigService {
  config = new BehaviorSubject<InitConfig>({
    serviceUrl: ''
  });
}

export function provideInitConfig(): EnvironmentProviders {
  return makeEnvironmentProviders([{
    provide: APP_INITIALIZER,
    useFactory: (
      http = inject(HttpClient),
      cfgService =inject(InitConfigService)
    ) => () =>
      http.get<InitConfig>('./assets/runtime/config.json').pipe(
        delay(5_000),
        tap(config => cfgService.config.next(config)
      )
    ),
    multi: true
  }]);
}

export function injectInitState(): Observable<InitConfig> {
  return inject(InitConfigService).config;
}
