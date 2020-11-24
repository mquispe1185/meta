import { Component, OnInit, ViewChild } from '@angular/core';
import { Promocion } from '../../../modelos/promocion';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularTokenService } from 'angular-token';
import { PromocionesService } from '../../../servicios/promociones.service';
import { ConfirmationDialogService } from 'src/app/servicios/confirmation-dialog.service';

@Component({
  selector: 'app-listadopromos',
  templateUrl: './listadopromos.component.html',
  styleUrls: ['./listadopromos.component.css']
})
export class ListadopromosComponent implements OnInit {

  dspColPromos: string[] = ['comercio','titulo','descripcion','formapago','estado','acciones'];
  promocion:Promocion = new Promocion();
  lstPromos:any;
  promociones:Promocion[];
  closeResult: string;
  @ViewChild(MatPaginator) paginatorPromos: MatPaginator;

  constructor( public tokenService: AngularTokenService,
    private promoService: PromocionesService,
    private confirmationDialogService: ConfirmationDialogService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.tokenService.validateToken().subscribe(
      res => {this.getPromos();}
    )
  }

  getPromos(){
    this.promoService.getPromociones().subscribe(
      prs => {  console.log('promos',prs);
      this.promociones = prs;
        this.lstPromos = new MatTableDataSource(prs);
        this.lstPromos.paginator = this.paginatorPromos;
      },
      err => {}
    );
  }

  dialogAprobarPromo(element){
    var msj = '';
    var tit = '';
    if (element.habilitado){
      tit = 'Deshablitar';
      msj = `Deshabilitar promoción ${element.titulo} ?`;
    }else{
     tit = 'Habilitar';
      msj = `Aprobar promoción ${element.titulo} ?`;
    }

    if(element.estado === 0){
      element.estado = 1;
    }else{
      element.estado = 0;
    }
    this.confirmationDialogService.confirm(tit, msj)
      .then(
        (confirm) => {(confirm) ? this.aprobarPromo(element) : console.log("cancelado");
                      }
      ).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  aprobarPromo(element){
    this.promoService.habilitarPromo(element).subscribe(
      pr =>{
        this.modalService.dismissAll();
        let index = this.promociones.findIndex( p => p.id === pr.id);
        this.promociones[index] = new Promocion(pr);

      }
    )
  }

  openFormInfo(modal,element){
    this.promocion = {...element};
    this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
