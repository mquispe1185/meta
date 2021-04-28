import { Component, OnInit } from '@angular/core';
import { DatosService } from 'src/app/servicios/datos.service';
import { MensajeConsulta } from '../../modelos/mensaje-consulta';


import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AngularTokenService } from 'angular-token';
import { DeviceDetectorService } from 'ngx-device-detector';


@Component({
  selector: 'app-contactate',
  templateUrl: './contactate.component.html',
  styleUrls: ['./contactate.component.css']
})

export class ContactateComponent implements OnInit {
  enviado=false;
  emailpattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  consulta:MensajeConsulta= new MensajeConsulta();

  public faceapp:SafeResourceUrl;
  public safeURL:SafeResourceUrl;

  constructor( private sanitizer:DomSanitizer,
    public tokenService: AngularTokenService,
    public router: Router,
    public deviceService: DeviceDetectorService,
    private datosService:DatosService ) { }

  ngOnInit(): void {
    this.setWspLik();
  }

  sendMail(){
    this.datosService.sendConsulta(this.consulta).subscribe(
      res => { this.enviado = true; }
    )
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
