import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { injectInitState } from '../config.init';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  config$ = injectInitState();
}
