import { ComercioService } from './../../../servicios/comercio.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Comercio } from '../../../modelos/comercio';
import { AngularTokenService } from 'angular-token';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from '../../../servicios/confirmation-dialog.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-listadocomercios',
  templateUrl: './listadocomercios.component.html',
  styleUrls: ['./listadocomercios.component.css']
})
export class ListadocomerciosComponent implements OnInit {

  lstComercios:any;
  dspCol: string[] = ['nombre','rubro','usuario','domicilio','tiposervicio', 'acciones'];
  @ViewChild(MatPaginator) paginatorCom: MatPaginator;
 comercioSelected:Comercio = new Comercio();

  closeResult: string;


  constructor(public tokenService: AngularTokenService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private confirmationDialogService: ConfirmationDialogService,
              private comercioService:ComercioService,) { }

  ngOnInit(): void {
    this.tokenService.validateToken().subscribe(
      res =>{ this.getComercios(); }
    );
   
  }

  getComercios(){
    this.comercioService.getComercios().subscribe(
      cms =>{ this.lstComercios = new MatTableDataSource(cms.map(c => new Comercio(c)));
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
      msj = `Aprobar al comercio${element.nombre} ?`;
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

  dialogEliminarComercio(element){
    this.confirmationDialogService.confirm('Eliminar?', `Esta seguro de eliminar al usuario ${element.nombre} ?`)
      .then(
        (confirm) => {(confirm) ? this.eliminarComercio(element) : console.log("cancelado");
                      }
      ).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  eliminarComercio(element){
    element.activo = false;
    this.comercioService.deleteComercio(element).subscribe(
      cms =>{this.lstComercios = new MatTableDataSource(cms.map(c => new Comercio(c)));
                this.lstComercios.paginator = this.paginatorCom;
                this.toastr.success('Aprobado!', 'Nuevo comercio aprobado!'); }
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
