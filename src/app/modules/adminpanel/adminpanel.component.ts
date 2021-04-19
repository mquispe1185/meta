import { ConfirmationDialogService } from './../../servicios/confirmation-dialog.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularTokenService } from 'angular-token';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosService } from '../../servicios/usuarios.service';
import { MatPaginator } from '@angular/material/paginator';
import { Usuario } from '../../modelos/usuario';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.css']
})
export class AdminpanelComponent implements OnInit {

  lstUsuarios:any;
  dspColUsuarios: string[] = ['nombre','email','prov', 'acciones'];
  @ViewChild(MatPaginator) paginatorUsuarios: MatPaginator;
  usuarioSelected: Usuario = new Usuario();

  closeResult: string;

  constructor(public tokenService: AngularTokenService,
              private modalService: NgbModal,
              private toastr: ToastrService,
              private confirmationDialogService: ConfirmationDialogService,
              private usuarioService:UsuariosService,) { }

  ngOnInit(): void {
    this.tokenService.processOAuthCallback();
    this.tokenService.validateToken().subscribe(
      res => {this.getUsuarios();}
    )
  }

  getUsuarios(){
    this.usuarioService.getUsuarios().subscribe(
      usr => {
        this.lstUsuarios = new MatTableDataSource(usr);
        this.lstUsuarios.paginator = this.paginatorUsuarios;
      },
      err => {}
    );
  }


  filtrarUsuarios(term){

  }

  dialogAprobarUsuario(element){
    var msj = '';
    var tit = '';
    if (element.habilitado){
      tit = 'Deshablitar';
      msj = `Deshabilitar al usuario ${element.nombre} ?`;
    }else{
     tit = 'Habilitar';
      msj = `Aprobar al usuario ${element.nombre} ?`;
    }
    this.confirmationDialogService.confirm(tit, msj)
      .then(
        (confirm) => {(confirm) ? this.aprobarUsuario(element) : console.log("cancelado");
                      }
      ).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  aprobarUsuario(element){
    element.habilitado = !element.habilitado;
    this.usuarioService.habilitarUsuario(element).subscribe(
      usr =>{this.lstUsuarios = new MatTableDataSource(usr);
                this.lstUsuarios.paginator = this.paginatorUsuarios;
                this.toastr.success('Estado actualizado correctamente!', 'Actualizado!'); }
    )
  }

  dialogEliminarUsuario(element){
    this.confirmationDialogService.confirm('Eliminar?', `Esta seguro de eliminar al usuario ${element.nombre} ?`)
      .then(
        (confirm) => {(confirm) ? this.eliminarUsuario(element) : console.log("cancelado");
                      }
      ).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  eliminarUsuario(element){
    element.activo = false;
    this.usuarioService.updateUsuario(element).subscribe(
      usr =>{this.lstUsuarios = new MatTableDataSource(usr);
                this.lstUsuarios.paginator = this.paginatorUsuarios;
                this.toastr.success('Aprobado!', 'Nuevo usuario aprobado!'); }
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
