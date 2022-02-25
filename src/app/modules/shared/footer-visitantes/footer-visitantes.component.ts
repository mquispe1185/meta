import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AngularTokenService } from 'angular-token';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-footer-visitantes',
  templateUrl: './footer-visitantes.component.html',
  styleUrls: ['./footer-visitantes.component.css']
})
export class FooterVisitantesComponent implements OnInit {

  public faceapp:SafeResourceUrl;
  public safeURL:SafeResourceUrl;

  constructor(private sanitizer:DomSanitizer,
              public tokenService: AngularTokenService,
              public router: Router,
              public deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.setWspLik();
  }

  setWspLik(){
    if (this.deviceService.isMobile()){
      this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl('whatsapp://send?phone=+543874522407');
    }else{
      this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://web.whatsapp.com/send?phone=543874522407');
    }
  }

  irAPanel(){
    if (this.tokenService.currentUserData === null || this.tokenService.currentUserData === undefined){
      this.login();
    }else{
    switch(this.tokenService.currentUserData.rol_id) {
      case 1: {
        this.router.navigate(['listacomercios']);
        break;
      }
      case 2: case 3: {
        this.router.navigate(['comerciopanel']);
        break;
      }

   }
    }
  }

  login(){
    this.tokenService.signInOAuth('google');
  }
}
