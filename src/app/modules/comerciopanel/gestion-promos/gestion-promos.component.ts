import { Formapago } from './../../../modelos/formapago';
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
import { ToastrService } from 'ngx-toastr';
import { TipoServicio } from '../../../modelos/tipo-servicio';
import { DatosService } from '../../../servicios/datos.service';
import { ConfirmationDialogService } from 'src/app/servicios/confirmation-dialog.service';

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
   dspColPromos: string[] = ['titulo','descripcion','formapago','estado','acciones'];
   promocion:Promocion = new Promocion();
   lstPromos:any;
   formapagos:Formapago[];
   totalpromo = 0;

   mis_promociones:Promocion[];

   @ViewChild(MatPaginator) paginatorPromos: MatPaginator;
  constructor(  public tokenService: AngularTokenService,
                private promoService: PromocionesService,
                private datepipe: DatePipe,
                private toastr: ToastrService,
                private datosService:DatosService,
                private confirmationDialogService: ConfirmationDialogService,
                private modalService: NgbModal,) { }

  ngOnInit(): void {
    console.log('comercios',this.mis_comercios),
    this.getPromos();
  }

  getPromos(){
    this.promoService.getMisPromo().subscribe(
      prs => { console.log('promos',prs);
        this.mis_promociones = prs;
        this.lstPromos = new MatTableDataSource(prs);
        this.lstPromos.paginator = this.paginatorPromos;
      },
      err => {}
    );
  }


   //PROMOCIONES
   openFormPromo(modal){
    //this.comercio = comer;
    this.error = false;
    this.promocion = new Promocion();
    this.desde = new FormControl(new Date());
    this.hasta = new FormControl(new Date());
    this.getFormapagos();
    this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  calcularDias(event: MatDatepickerInputEvent<Date>,opcion:number){
    let dife;let des:any;let has:any;
    if(opcion ===1){
      console.log('click desde');
      des = new Date(event.value);
      des.setHours(0,0,0,0);
      has = new Date(this.hasta.value);
      has.setHours(0,0,0,0);

    }else if (opcion ===2) {
      des = new Date(this.desde.value);
      des.setHours(0,0,0,0);
      has = new Date(event.value);
    }
    dife =  Math.floor(( has - des) / 86400000);

   if (this.hasta.value < this.desde.value){
     this.error = true;
     this.mensaje_error = 'fecha hasta debe ser mayor a fecha desde';
   }else{
    this.error = false;
   }
    this.promocion.duracion = dife;
    let comercio;
    if (this.promocion.comercio_id){
      comercio = this.mis_comercios.find(element => element.id === this.promocion.comercio_id);
    }else{
      comercio = this.mis_comercios.find(element => element.id === this.promocion.comercio.id);
    }
    this.promocion.importe = this.promocion.totalCosto(comercio.tipo_servicio.id);
  }


  crearPromo(){
    this.promocion.desde = this.datepipe.transform(new Date(this.desde.value),'yyyy-MM-dd');
    this.promocion.hasta = this.datepipe.transform(new Date(this.hasta.value),'yyyy-MM-dd');
    console.log('promooo',this.promocion);
    this.promoService.createPromocion(this.promocion).subscribe(
      prs =>{ this.lstPromos = new MatTableDataSource(prs);
                this.lstPromos.paginator = this.paginatorPromos;
                this.toastr.warning('Promoción creada!', 'Pendiente de aprobación!');
              this.modalService.dismissAll();}
    )

  }

  editarPromo(modal,element){
    this.error = false;
    this.promocion = new Promocion(element);
    let d = new Date(this.promocion.desde);
    d.setDate(d.getDate()+1);
    let h = new Date(this.promocion.hasta);
    h.setDate(h.getDate()+1);
    console.log('dddddd',d);
    console.log('hhhhh',h);
    console.log('fecha act', new Date());
    this.desde = new FormControl(d);
    //this.hasta = new FormControl(new Date(this.promocion.hasta));
    this.hasta = new FormControl(h);

    this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  updatePromo(){
    this.promocion.desde = this.datepipe.transform(new Date(this.desde.value),'yyyy-MM-dd');
    this.promocion.hasta = this.datepipe.transform(new Date(this.hasta.value),'yyyy-MM-dd');
    this.promoService.updatePromocion(this.promocion).subscribe(
      pr =>{  console.log('promo enviada',this.promocion);
              let index = this.mis_promociones.findIndex( p => p.id === pr.id);
              this.mis_promociones[index] = new Promocion(pr);
              this.lstPromos = new MatTableDataSource(this.mis_promociones);
              this.lstPromos.paginator = this.paginatorPromos;
              this.toastr.success('Promoción actualizada!', 'Pendiente de aprobación!');
              this.modalService.dismissAll();

      }
    )
  }
  dialogEliminar(element){
    this.promocion = element;
    this.confirmationDialogService.confirm('Eliminar?', `Esta seguro de eliminar esta promo ?`)
      .then(
        (confirm) => {(confirm) ? this.eliminarPromo(element) : console.log("cancelado");
                      }
      ).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  eliminarPromo(element){
    this.promoService.deletePromocion(this.promocion).subscribe(
      pr=>{ let index = this.mis_promociones.findIndex( p => p.id === this.promocion.id);
            this.mis_promociones.splice(index,1);
            this.lstPromos = new MatTableDataSource(this.mis_promociones);
            this.lstPromos.paginator = this.paginatorPromos;
            this.promocion = null;
            this.toastr.error('Promoción eliminada!', 'ya no existe en el sistema!');
            this.modalService.dismissAll();
          }
    )
  }
  getFormapagos(){
    this.datosService.getFormapagos().subscribe(
      fps => {this.formapagos = fps;}
    )
  }

  filtrarPromos(term){
    this.lstPromos.filter = term.trim().toLowerCase();
  }

  openFormInfo(modal,element){
    this.promocion = {...element};
    this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
