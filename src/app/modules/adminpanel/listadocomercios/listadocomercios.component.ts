import { ComercioService } from './../../../servicios/comercio.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Comercio } from '../../../modelos/comercio';
import { AngularTokenService } from 'angular-token';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../../../servicios/confirmation-dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { Rubro } from 'src/app/modelos/rubro';
import { RubroService } from 'src/app/servicios/rubro.service';
import { Semana } from 'src/app/modelos/semana';
import { Horario } from 'src/app/modelos/horario';
import { HorarioService } from 'src/app/servicios/horario.service';

@Component({
  selector: 'app-listadocomercios',
  templateUrl: './listadocomercios.component.html',
  styleUrls: ['./listadocomercios.component.css']
})
export class ListadocomerciosComponent implements OnInit {

  lstComercios:any;
  aux_comercios:Comercio[];
  dspCol: string[] = ['nombre','rubro','usuario','domicilio','tiposervicio','acciones'];
  @ViewChild(MatPaginator) paginatorCom: MatPaginator;
  comercioSelected:Comercio = new Comercio();
  rubros: Rubro[] = [];
  semana = Semana.semana;
  closeResult: string;
  horarios: Horario[] = [];
  nuevos_horarios: Horario[] = [];
  nuevo_horario: Horario;
  horario_aux: Horario;


  constructor(public tokenService: AngularTokenService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private confirmationDialogService: ConfirmationDialogService,
              private horarioService: HorarioService,
              private rubroService: RubroService,
              private comercioService:ComercioService,) { }

  ngOnInit(): void {
    this.tokenService.validateToken().subscribe(
      res =>{ this.getComercios(); }
    );

  }

  getComercios(){
    this.comercioService.getComercios().subscribe(
      cms =>{ this.aux_comercios = cms.map(c => new Comercio(c));
              this.lstComercios = new MatTableDataSource(this.aux_comercios);
              this.lstComercios.paginator = this.paginatorCom;
             }
    )
  }

  filtrarComercios(term){
    this.lstComercios.filter = term.trim().toLowerCase();
  }

  dialogAprobarComercio(element){
    var msj = '';
    var tit = '';
    if (element.habilitado){
      tit = 'Deshablitar';
      msj = `Deshabilitar al comercio ${element.nombre} ?`;
    }else{
     tit = 'Habilitar';
      msj = `Aprobar al comercio ${element.nombre} ?`;
    }
    this.confirmationDialogService.confirm(tit, msj)
      .then(
        (confirm) => {(confirm) ? this.aprobarComercio(element) : console.log("cancelado");
                      }
      ).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  aprobarComercio(element){
    //element.habilitado = !element.habilitado;
    this.comercioService.habilitarComercio(element.id).subscribe(
      cms =>{ this.lstComercios = new MatTableDataSource(cms.map(c => new Comercio(c)));

        this.lstComercios.paginator = this.paginatorCom;
                this.toastr.success('Estado actualizado correctamente!', 'Actualizado!'); }
    )
  }
 
  openFormEditar(modal,comer){
    this.comercioSelected = new Comercio(comer);
    if (this.rubros.length === 0){
      this.getRubros();
    }
    this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  updateComercio(){
    this.comercioService.updateComercio(this.comercioSelected).subscribe(
      cms =>{this.lstComercios = new MatTableDataSource(cms.map(c => new Comercio(c)));
          this.modalService.dismissAll();
        this.toastr.success('bien hecho!', 'Datos actualizados!');}
    )
  }


  dialogEliminarComercio(element){
    this.confirmationDialogService.confirm('Eliminar?', `Esta seguro de eliminar al comercio ${element.nombre} ?`)
      .then(
        (confirm) => {(confirm) ? this.eliminarComercio(element) : console.log("cancelado");
                      }
      ).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  eliminarComercio(element){
    element.activo = false;
    this.comercioService.deleteComercio(element).subscribe(
      cms =>{ let index = this.aux_comercios.findIndex( p => p.id === element.id);
              this.aux_comercios.splice(index,1);
              this.lstComercios = new MatTableDataSource(this.aux_comercios);
              this.lstComercios.paginator = this.paginatorCom;
              this.toastr.error('Eiminado!', 'Comercio eliminado!'); }
    )
  }


  openFormInfo(modal,element){
    this.comercioSelected = {...element};
    this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getRubros(){
    this.rubroService.getRubros().subscribe(
      rs => {
            this.rubros = rs; }
    );
  } 

  //gestion de horarios
  openFormHorario(modal, comercio){
    this.comercioSelected = {...comercio};
    this.semana.forEach(d => {d.check = false});
    this.nuevo_horario = new Horario();
      this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    setDia(event, dia){

    }
    addHorario(){
      this.nuevos_horarios = [];
      this.semana.forEach(
        d => {
          this.horario_aux = new Horario();
          if (d.check){
            this.horario_aux.dia = d.id;
            this.horario_aux.desde = this.nuevo_horario.desde;
            this.horario_aux.hasta = this.nuevo_horario.hasta;

            this.horario_aux.comercio_id = this.comercioSelected.id;

            this.nuevos_horarios.push(this.horario_aux);
          }
        }
      );

      this.horarioService.saveHorarios(this.nuevos_horarios).subscribe(
        hs => {this.comercioSelected.horarios = hs;
          this.modalService.dismissAll();
          this.toastr.success('bien hecho!', 'Horario/s agregados!'); }
      )
    }
    dialogEliminarHorario(element){

      this.confirmationDialogService.confirm('Eliminar?', `Esta seguro de eliminar este horario del dia ${element.dia_nombre} ?`)
        .then(
          (confirm) => {(confirm) ? this.eliminarHorario(element) : console.log("cancelado");
                        }
        ).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }
    eliminarHorario(horario){
      this.horarioService.deleteHorario(horario).subscribe(
        hs => {
          this.modalService.dismissAll();
          this.toastr.error('bien hecho!', 'Horario/s eliminado!'); }
      )
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
