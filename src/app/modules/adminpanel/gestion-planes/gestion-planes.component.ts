import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Comercio } from '../../../modelos/comercio';
import { AngularTokenService } from 'angular-token';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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
  dspCol: string[] = ['nombre','usuario','tiposervicio','validez','formapago','estado', 'acciones'];
  @ViewChild(MatPaginator) paginatorCom: MatPaginator;
 comercioSelected:Comercioplan = new Comercioplan();

  closeResult: string;


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
      cms =>{ this.lstComerciosplan = new MatTableDataSource(cms.map(c => new Comercioplan(c)));
              this.lstComerciosplan.paginator = this.paginatorCom;
             }
    )
  }

  filtrarComercios(term){
    this.lstComerciosplan.filter = term.trim().toLowerCase();
  }

  dialogAprobarPlan(element){

  }

  dialogEliminarPedido(element){

  }
}
