import { Component, OnInit, ViewChild } from '@angular/core';
import { Promocion } from '../../../modelos/promocion';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularTokenService } from 'angular-token';
import { PromocionesService } from '../../../servicios/promociones.service';

@Component({
  selector: 'app-listadopromos',
  templateUrl: './listadopromos.component.html',
  styleUrls: ['./listadopromos.component.css']
})
export class ListadopromosComponent implements OnInit {

  dspColPromos: string[] = ['comercio','titulo','descripcion','acciones'];
  promocion:Promocion = new Promocion();
  lstPromos:any;
  @ViewChild(MatPaginator) paginatorPromos: MatPaginator;
  
  constructor( public tokenService: AngularTokenService,
    private promoService: PromocionesService,
    private modalService: NgbModal,) { }

  ngOnInit(): void {
    this.tokenService.validateToken().subscribe(
      res => {this.getPromos();}
    )
  }

  getPromos(){
    this.promoService.getPromociones().subscribe(
      prs => {  console.log('promos',prs);
        this.lstPromos = new MatTableDataSource(prs);
        this.lstPromos.paginator = this.paginatorPromos;
      },
      err => {}
    );
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
