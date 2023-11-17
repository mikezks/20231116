import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FlightService } from '@flight-demo/tickets/domain';

@Component({
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterLink, RouterLinkActive],
  selector: 'app-sidebar-cmp',
  templateUrl: 'sidebar.component.html',
})
export class SidebarComponent {
  private flightService = inject(FlightService);
  protected flightCount$ = this.flightService.flightCount$;
}
