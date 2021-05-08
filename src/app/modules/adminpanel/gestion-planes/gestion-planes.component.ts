import { Semana } from './../../../modelos/semana';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Comercio } from '../../../modelos/comercio';
import { AngularTokenService } from 'angular-token';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../../../servicios/confirmation-dialog.service';
import { ComercioService } from '../../../servicios/comercio.service';
import { MatTableDataSource } from '@angular/material/table';
import { Comercioplan } from '../../../modelos/comercioplan';

@Component({
  selector: 'app-gestion-planes',
  templateUrl: './gestion-planes.component.html',
  styleUrls: ['./gestion-planes.component.css']
})
export class GestionPlanesComponent implements OnInit {

  lstComerciosplan:any;
  comerciosplan:Comercioplan[];
  dspCol: string[] = ['nombre','usuario','tiposervicio','validez','formapago','estado', 'acciones'];
  @ViewChild(MatPaginator) paginatorCom: MatPaginator;
  comercioplanSelected:Comercioplan = new Comercioplan();

  closeResult: string;

estadosplan = Semana.estadosplan;
  constructor(public tokenService: AngularTokenService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private confirmationDialogService: ConfirmationDialogService,
              private comercioService:ComercioService,) { }

  ngOnInit(): void {
    this.tokenService.validateToken().subscribe(
      res =>{ this.getComerciosplan(); }
    );
  }

  getComerciosplan(){
    this.comercioService.getComerciosPlanes().subscribe(
      cms =>{ this.comerciosplan = cms;
              this.lstComerciosplan = new MatTableDataSource(cms.map(c => new Comercioplan(c)));
              this.lstComerciosplan.paginator = this.paginatorCom;
             }
    )
  }

  filtrarComercios(term){
    this.lstComerciosplan.filter = term.trim().toLowerCase();
  }

 //PROMOCIONES
 openFormActualizar(modal,element){
  this.comercioplanSelected = {...element};
  this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

  actualizarPlan(){

    this.comercioService.habilitarComercioplan(this.comercioplanSelected).subscribe(
      cms =>{
        this.modalService.dismissAll();
        let index = this.comerciosplan.findIndex( c => c.id === cms.id)
        this.comerciosplan[index] = new Comercioplan(cms);
        this.toastr.success('bien hecho!', 'Plan correctamente actualizado!');
        this.lstComerciosplan = new MatTableDataSource(this.comerciosplan.map(c => new Comercioplan(c)));
              this.lstComerciosplan.paginator = this.paginatorCom;}
    )

  }

  verInfo(element){

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
