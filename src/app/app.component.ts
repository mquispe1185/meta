import { Component } from '@angular/core';
import { AngularTokenService } from 'angular-token';
import { Router, NavigationEnd } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'meta-app';
  esInicio=false;
  public spinkit = Spinkit;
  public safeURL:SafeResourceUrl;

  constructor(public tokenService: AngularTokenService,
              private router: Router,
              public deviceService: DeviceDetectorService,
              private sanitizer:DomSanitizer,
   ) {
        this.router.events.subscribe((ev) => {
        if (ev instanceof NavigationEnd) {
          if (ev.url === '/' || ev.url.includes('/inicio') || ev.url === '/quienes-somos' || ev.url.includes('/politica')){
            this.esInicio = true;
            // console.log('esInicio',this.esInicio);
          }else{
            this.esInicio = false;
            // console.log('esInicio',this.esInicio);
          }
        }
    });



   }

   ngOnInit(): void {
    this.btnWsp();
  }

      //BUTTON WHATSAPP
      btnWsp(){
        if (this.deviceService.isMobile()){
          //SI ESTA UTILIZANDO MOBILE ABRE LA APLICACION WSP
          this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl('whatsapp://send?phone=+543874522407');
        }else{
          //SI ESTA UTILIZANDO DESKTOP ABRE LA WEB WSP
          this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://web.whatsapp.com/send?phone=543874522407');
        }
      }
}

   