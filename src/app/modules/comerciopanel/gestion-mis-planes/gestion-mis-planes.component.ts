import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularTokenService } from 'angular-token';
import { ToastrService } from 'ngx-toastr';
import { Comercioplan } from 'src/app/modelos/comercioplan';
import { ComercioService } from 'src/app/servicios/comercio.service';
import { ConfirmationDialogService } from 'src/app/servicios/confirmation-dialog.service';

@Component({
  selector: 'app-gestion-mis-planes',
  templateUrl: './gestion-mis-planes.component.html',
  styleUrls: ['./gestion-mis-planes.component.css']
})
export class GestionMisPlanesComponent implements OnInit {

  dspCol: string[] = ['nombre','tiposervicio','desde','hasta','formapago','estado', 'acciones'];
  lstComerciosplan:any;
  comerciosplan:Comercioplan[];
  @ViewChild(MatPaginator) paginatorCom: MatPaginator;
  comercioplanSelected:Comercioplan = new Comercioplan();

  closeResult: string;
  constructor(public tokenService: AngularTokenService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private confirmationDialogService: ConfirmationDialogService,
              private comercioService:ComercioService){
  }

  ngOnInit(): void {
    this.tokenService.validateToken().subscribe(
      res =>{ this.getMisComerciosplan(); }
    );
  }

  getMisComerciosplan(){
    this.comercioService.getMisComerciosPlanes().subscribe(
      cms =>{ this.comerciosplan = cms.map(c => new Comercioplan(c));
              this.lstComerciosplan = new MatTableDataSource(this.comerciosplan);
              this.lstComerciosplan.paginator = this.paginatorCom;
             }
    )
  }

  filtrarPlanes(term){
    console.log("termino",term)
    this.lstComerciosplan.filter = term.trim().toLowerCase();
  }
}
