import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularTokenService } from 'angular-token';
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
  constructor(private comercioService:ComercioService,
              public tokenService: AngularTokenService,
              private refeService:ReferenciaService,
              private modalService: NgbModal,
              private router: Router,
              private toastr: ToastrService,) { }

  ngOnInit(): void {

    if(localStorage.hasOwnProperty("comercio_id")){
      let comercio_id = localStorage.getItem('comercio_id');
      this.comercioService.getComercio(+comercio_id).subscribe(
        cm =>{this.comercio= cm;
          this.lat = +this.comercio.latitud;
          this.lon = +this.comercio.longitud;}
      )
    }else{
    this.comercio = JSON.parse(localStorage.getItem('comercio'));
    this.lat = +this.comercio.latitud;
    this.lon = +this.comercio.longitud;
    }
    console.log('comercio en ver',this.comercio);
    this.zoom = 16;
    this.getReferencias();
  }

  getReferencias(){
    this.refeService.getReferencias(this.comercio.id).subscribe(
      refs =>{ console.log('referenciasss',refs);
                this.referencias = refs;
      }
    )
  }

  crearReferencia(modal){

    if (this.tokenService.currentUserData){
      console.log('logeuado para comentar??',this.tokenService.currentUserData.rol_id);
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
