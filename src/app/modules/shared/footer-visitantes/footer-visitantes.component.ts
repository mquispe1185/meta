import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
              public deviceService: DeviceDetectorService) { }

  ngOnInit(): void {
    this.setWspLik();
  }

  setWspLik(){
    if (this.deviceService.isMobile()){
      //console.log('celularrr',this.comercio.celular);
      this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl('whatsapp://send?phone=+543874522407');
      // this.wsp = 'whatsapp://send?phone=+54'+this.comercio.celular;
    }else{
      this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://web.whatsapp.com/send?phone=543874522407');
    }
  }
}
