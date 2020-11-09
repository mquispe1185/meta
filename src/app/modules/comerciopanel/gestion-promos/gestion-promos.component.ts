import { PromocionesService } from './../../../servicios/promociones.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Comercio } from '../../../modelos/comercio';
import { Promocion } from '../../../modelos/promocion';
import { AngularTokenService } from 'angular-token';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { getMatFormFieldDuplicatedHintError } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-gestion-promos',
  templateUrl: './gestion-promos.component.html',
  styleUrls: ['./gestion-promos.component.css']
})
export class GestionPromosComponent implements OnInit {

  closeResult: string;
  mensaje_error:string;
  error:boolean = false;
  comercio:Comercio;
  fecha = new Date('2020-11-01');
  desde = new FormControl(new Date());
  hasta = new FormControl(new Date());
  mis_comercios:Comercio[] = JSON.parse(localStorage.getItem('miscomercios'));
   //variables para promociones
   dspColPromos: string[] = ['titulo','descripcion','acciones'];
   promocion:Promocion = new Promocion();
   lstPromos:any;
   @ViewChild(MatPaginator) paginatorPromos: MatPaginator;
  constructor(  public tokenService: AngularTokenService,
                private promoService: PromocionesService,
                private datepipe: DatePipe,
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

  calcularDias(event: MatDatepickerInputEvent<Date>){
    let has:any = new Date(event.value);
    let dife = Math.abs(has - this.desde.value);
   if (this.hasta.value < this.desde.value){
     this.error = true;
     this.mensaje_error = 'fecha hasta debe ser mayor o igual a fecha desde';
   }else{
    this.error = false;
   }
    this.promocion.duracion = Math.ceil(dife / (1000 * 3600 * 24)); 
    console.log('defeee',Math.ceil(dife / (1000 * 3600 * 24)));
  }
  crearPromo(){
    this.promocion.desde = this.datepipe.transform(new Date(this.desde.value),'yyyy-MM-dd');
    this.promocion.hasta = this.datepipe.transform(new Date(this.hasta.value),'yyyy-MM-dd');
    this.promoService.createPromocion(this.promocion).subscribe(
      prs =>{ this.lstPromos = new MatTableDataSource(prs);
                this.lstPromos.paginator = this.paginatorPromos;
              this.modalService.dismissAll();}
    )
   
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
