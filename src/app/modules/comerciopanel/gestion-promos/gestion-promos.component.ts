import { PromocionesService } from './../../../servicios/promociones.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Comercio } from '../../../modelos/comercio';
import { Promocion } from '../../../modelos/promocion';
import { AngularTokenService } from 'angular-token';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-gestion-promos',
  templateUrl: './gestion-promos.component.html',
  styleUrls: ['./gestion-promos.component.css']
})
export class GestionPromosComponent implements OnInit {

  closeResult: string;
  comercio:Comercio;
  mis_comercios:Comercio[] = JSON.parse(localStorage.getItem('miscomercios'));
   //variables para promociones
   dspColPromos: string[] = ['titulo','descripcion','acciones'];
   promocion:Promocion = new Promocion();
   lstPromos:any;
   @ViewChild(MatPaginator) paginatorPromos: MatPaginator;
  constructor(  public tokenService: AngularTokenService,
                private promoService: PromocionesService,
                private modalService: NgbModal,) { }

  ngOnInit(): void {
    console.log('mis comercios desde storage',this.mis_comercios);
    this.getPromos();
  }

  getPromos(){
    this.promoService.getMisPromo().subscribe(
      prs => {  console.log('promos',prs);
        this.lstPromos = new MatTableDataSource(prs);
        this.lstPromos.paginator = this.paginatorPromos;
      },
      err => {}
    );
  }


   //PROMOCIONES
   openFormPromo(modal){
    //this.comercio = comer;
    this.promocion = new Promocion();
    this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  crearPromo(){
    console.log('promocion nueva',this.promocion);
  }

  updatePromo(){

  }

  filtrarPromos(term){
    this.lstPromos.filter = term.trim().toLowerCase();
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
