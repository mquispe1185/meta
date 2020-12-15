import { Component } from '@angular/core';
import { AngularTokenService } from 'angular-token';
import { Router, NavigationEnd } from '@angular/router';
import { Spinkit } from 'ng-http-loader';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'meta-app';
  esInicio=false;
  public spinkit = Spinkit;
  constructor(public tokenService: AngularTokenService,
    private router: Router
   ) {
console.log('situacion de logeo',this.tokenService.userSignedIn());
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        if (ev.url === '/' || ev.url.includes('/inicio') || ev.url === '/quienes-somos' || ev.url.includes('/politica')){
            this.esInicio = true;
            console.log('esInicio',this.esInicio);
        }else{
          this.esInicio = false;
          console.log('esInicio',this.esInicio);
        }

      }
    });
   }
}

