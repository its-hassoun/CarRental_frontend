import { Component } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'myRental-app';
  currentRoute: string = '';

  constructor(private router: Router) {
    this.router.events
      .pipe(filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentRoute = event.urlAfterRedirects;
      });
  }

  isLoginOrRegisterPage(): boolean {
    return this.currentRoute === '/' || this.currentRoute === '/register' ;
  }

  ngOnInit() {}
}
