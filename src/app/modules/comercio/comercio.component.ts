import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, ParamMap  } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularTokenService } from 'angular-token';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { ComercioService } from 'src/app/servicios/comercio.service';
import { ReferenciaService } from 'src/app/servicios/referencia.service';
import { Comercio } from '../../modelos/comercio';
import { Referencia } from '../../modelos/referencia';

@Component({
  selector: 'app-comercio',
  templateUrl: './comercio.component.html',
  styleUrls: ['./comercio.component.css']
})
export class ComercioComponent implements OnInit {

  comercio:Comercio = new Comercio();
  lat: number;
  lon:number;
  zoom:number;
  closeResult: string;
  referencia:Referencia;
  referencias:Referencia[];
  restan= 240;
  wsp:string;
  public safeURL: SafeResourceUrl;
  constructor(private comercioService:ComercioService,
              public tokenService: AngularTokenService,
              private refeService:ReferenciaService,
              private modalService: NgbModal,
              public deviceService: DeviceDetectorService,
              private router: Router,
              private route: ActivatedRoute,
              private sanitizer:DomSanitizer,
              private toastr: ToastrService,) { }

  ngOnInit(): void {

   let comerid = this.route.snapshot.paramMap.get('comercio');

    //if(localStorage.hasOwnProperty("comercio_id")){
    if(comerid != null){

      this.comercioService.getComercio(+comerid).subscribe(
        cm =>{this.comercio= cm;
          this.lat = +this.comercio.latitud;
          this.lon = +this.comercio.longitud;}
      )
    }else{
    this.comercio = JSON.parse(localStorage.getItem('comercio'));
    this.lat = +this.comercio.latitud;
    this.lon = +this.comercio.longitud;
    }

    this.zoom = 16;
    if (this.deviceService.isMobile()){
      this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl('whatsapp://send?phone=+54'+this.comercio.celular);
     // this.wsp = 'whatsapp://send?phone=+54'+this.comercio.celular;
    }else{
      this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://web.whatsapp.com/send?phone=54'+this.comercio.celular);
    }
    this.getReferencias();
  }

  getReferencias(){
    this.refeService.getReferencias(this.comercio.id).subscribe(
      refs =>{
                this.referencias = refs;
      }
    )
  }

  crearReferencia(modal){

    if (this.tokenService.currentUserData){

    this.referencia = new Referencia();
    this.referencia.puntaje = 0;
    this.restan = 240;
    this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    }else{
      console.log('entramos a loguearnos');
      localStorage.setItem('redirect',this.router.url);
      this.tokenService.signInOAuth('google');
    }
  }

  guardarReferencia(){
    this.referencia.comercio_id = this.comercio.id;
    this.refeService.createReferencia(this.referencia).subscribe(
      ref =>{ this.referencias.push(ref);
        this.toastr.success('Gracias!', 'Su comentario ha sido agregado');
        this.modalService.dismissAll();
      }
    )
  }

  contadorChar(event){
    this.restan = 240 - event.length ;
  }

   //Método para cerrar Modal con Tecla Escape.
   private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
