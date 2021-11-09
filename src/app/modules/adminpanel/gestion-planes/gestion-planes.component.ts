import { Comercioplan } from './../../../modelos/comercioplan';
import { ComercioplanService } from './../../../servicios/comercioplan.service';
import { Comercio } from './../../../modelos/comercio';
import { RubroService } from './../../../servicios/rubro.service';
import { TipoServicio } from './../../../modelos/tipo-servicio';
import { Semana } from './../../../modelos/semana';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { AngularTokenService } from 'angular-token';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../../../servicios/confirmation-dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { Formapago } from 'src/app/modelos/formapago';
import { DatosService } from 'src/app/servicios/datos.service';

@Component({
  selector: 'app-gestion-planes',
  templateUrl: './gestion-planes.component.html',
  styleUrls: ['./gestion-planes.component.css']
})
export class GestionPlanesComponent implements OnInit {

  lstComerciosplan:MatTableDataSource<any>;
  comerciosplan:Comercioplan[];
  dspCol: string[] = ['nombre','usuario','tiposervicio','validez','formapago','estado', 'acciones'];
  @ViewChild(MatPaginator) paginatorComplan: MatPaginator;
  comercioplanSelected:Comercioplan = new Comercioplan();
  closeResult: string;
  estadosplan = Semana.estadosplan;
  comercioSelected:Comercio = new Comercio();
  servicios: TipoServicio[]=[];
  formapagos: Formapago[];
  meses = Semana.meses;
  comercios: Comercio[] = [];
  comercio: Comercio;
  
  constructor(public tokenService: AngularTokenService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private comercioplanService:ComercioplanService,
              private datosService: DatosService,) { }

  ngOnInit(): void {
    this.tokenService.validateToken().subscribe(
      res =>{ this.getComerciosplan(); }
    );
  }

  getComerciosplan(){
    this.comercioplanService.getComerciosPlanes().subscribe(
      cms =>{ this.comerciosplan = cms.map(c => new Comercioplan(c));
              this.lstComerciosplan = new MatTableDataSource(this.comerciosplan);
              this.lstComerciosplan.paginator = this.paginatorComplan;
             }
    )
  }

  filtrarComerciosplan(term){
    this.lstComerciosplan.filterPredicate = function(data, filter: string): boolean {
      return data.comercio.nombre.toLowerCase().includes(filter) || data.usuario.nombre.toLowerCase().includes(filter);
    };
    this.lstComerciosplan.filter = term.trim().toLowerCase();
  }

  getServicios(){
    this.datosService.getTipoServicios().subscribe(
      res => {
        this.getFormapagos();
        this.servicios = res.map(s => new TipoServicio(s));
      });
  }

 //Funcion para Acciones Estado, Editar y VerInfo
 openFormActualizar(modal,element){
   this.estadosplan = this.estadosplan.filter(e => e.descripcion !='VENCIDO')
  if (this.servicios.length == 0){
    this.getServicios()
  }
  this.comercioplanSelected = {...element};
  this.comercioplanSelected.tipo_servicio_id = this.comercioplanSelected.tipo_servicio.id;
  this.comercioplanSelected.formapago_id = this.comercioplanSelected.formapago.id;
  this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

// MODAL Editar Plan Servicio -->
updateTipoPlan() {
  this.comercioplanSelected.tipo_servicio_id = this.comercioplanSelected.tipo_servicio.id;
    this.comercioplanService.editComercioPlanByAdmin(this.comercioplanSelected).subscribe(
    res => {
      console.log('respuesta update',res)
      this.modalService.dismissAll();
      let index = this.comerciosplan.findIndex(c => c.id === this.comercioplanSelected.id)
      this.comerciosplan[index] = new Comercioplan(res);
      this.lstComerciosplan = new MatTableDataSource(this.comerciosplan);
      this.toastr.success('Bien hecho!', 'Plan Modificado con exito!');
    }
  )
}

calcularTotalServicio(servicio) {
  this.comercioplanSelected.tipo_servicio = this.servicios.find(s => s.id === servicio);
  this.comercioplanSelected.importe = this.comercioplanSelected.meses * this.comercioplanSelected.tipo_servicio.importe;
}

calcularTotalMes(mes) {
  this.comercioplanSelected.importe = this.comercioplanSelected.meses * this.comercioplanSelected.tipo_servicio.importe;
}

getFormapagos() {
  this.datosService.getFormapagos().subscribe(
    fps => { this.formapagos = fps; }
  )
}

//Fin  MODAL Modificar Estado de Plan Solicitado -->
  actualizarPlan(){
    this.comercioplanService.habilitarComercioplan(this.comercioplanSelected).subscribe(
      cms =>{
        this.modalService.dismissAll();
        let index = this.comerciosplan.findIndex( c => c.id === cms.id)
        this.comerciosplan[index] = new Comercioplan(cms);
        this.toastr.success('Bien hecho!', 'Estado de Plan Modificado!');
        this.lstComerciosplan = new MatTableDataSource(this.comerciosplan.map(c => new Comercioplan(c)));
        this.lstComerciosplan.paginator = this.paginatorComplan;}
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
