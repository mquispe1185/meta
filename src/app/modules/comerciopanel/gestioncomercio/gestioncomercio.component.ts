import { HorarioService } from './../../../servicios/horario.service';
import { Semana } from './../../../modelos/semana';
import { ComercioService } from './../../../servicios/comercio.service';
import { Comercio } from './../../../modelos/comercio';
import { Component, OnInit, NgZone, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Provincia } from '../../../modelos/provincia';
import { Departamento } from '../../../modelos/departamento';
import { Localidad } from '../../../modelos/localidad';
import { AngularTokenService } from 'angular-token';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UbicacionService } from '../../../servicios/ubicacion.service';
import { RubroService } from '../../../servicios/rubro.service';
import { Rubro } from '../../../modelos/rubro';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { FormControl } from '@angular/forms';
import { ModalGooglePlacesComponent } from '../modal-google-places/modal-google-places.component';
import { Horario } from '../../../modelos/horario';
import { ConfirmationDialogService } from '../../../servicios/confirmation-dialog.service';

@Component({
  selector: 'app-gestioncomercio',
  templateUrl: './gestioncomercio.component.html',
  styleUrls: ['./gestioncomercio.component.css']
})
export class GestioncomercioComponent implements OnInit {

  closeResult: string;
  comercio:Comercio;
  provincias:Provincia[]=[];
  departamentos:Departamento[]=[];
  provincia_id:number;
  depatramento_id:number;
  localidades:Localidad[]=[];
  rubros:Rubro[]=[];
  comercios:Comercio[]=[];
  semana = Semana.semana;
  horarios:Horario[]=[];
  nuevos_horarios:Horario[]=[];
  nuevo_horario:Horario;
  horario_aux:Horario;

  nueva_foto:File;

  timestamp:string;

  constructor(  public tokenService: AngularTokenService,
                private modalService: NgbModal,
                private ubicacionService:UbicacionService,
                private rubroService: RubroService,
                private comercioService:ComercioService,
                private horarioService:HorarioService,
                private cdRef: ChangeDetectorRef,
                private confirmationDialogService: ConfirmationDialogService,
                private toastr: ToastrService,) { }

  ngOnInit(): void {
   
    this.getComercios();
    this.getProvincias();
    this.getRubros();
  }

  getComercios(){
    this.comercioService.getComercios().subscribe(
      cms =>{this.comercios = cms;
              console.log('mis comerc',cms);
             }
    )
  }

  getLinkPicture(comer) {
   if (comer){}
    return comer.url_foto + '?' + (new Date()).getTime();
}

  openFormAgregar(modal){
    this.comercio = new Comercio();
    
    this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openFormEditarComercio(modal,comer){
    this.comercio = comer;
    
    this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getRubros(){
    this.rubroService.getRubros().subscribe(
      rs =>{ console.log('rubrooos',rs);
            this.rubros = rs;}
    );
  }
  getProvincias(){
    this.ubicacionService.getProvincias().subscribe(
      provs => {
                this.provincias = provs;
      }
    )
  }

  buscarDtos(event){
    this.provincia_id = event.value;
    this.ubicacionService.getDptos(this.provincia_id).subscribe(
      dtos => { this.departamentos = dtos; console.log('deptos',dtos);}
    )
  }

  buscarLocs(event){
    this.depatramento_id = event.value;
    this.ubicacionService.getLocalidad(this.depatramento_id).subscribe(
      locs => {this.localidades = locs}
    )
  }

  altaComercio(){
    this.comercioService.createComercio(this.comercio).subscribe(
      cms =>{this.comercios = cms;
          this.modalService.dismissAll();
        this.toastr.success('bien hecho!', 'Nuevo comercio creado!');}
    )
  }

  updateComercio(){
    this.comercioService.updateComercio(this.comercio).subscribe(
      cms =>{this.comercios = cms;
          this.modalService.dismissAll();
        this.toastr.success('bien hecho!', 'Datos actualizados!');}
    )
  }


  openFormAgregarUbicacion(element){
      const modalRefCity = this.modalService.open(ModalGooglePlacesComponent);
      modalRefCity.componentInstance.comercio = element;
       modalRefCity.componentInstance.comercioevent.subscribe(($e) => {
        this.actualizarUbicacion($e);
        this.modalService.dismissAll();
       
      })
    }
  
    actualizarUbicacion(comercio){
      //console.log('comercioooo',comercio); 
      this.comercioService.updateComercio(comercio).subscribe(
        cms =>{this.comercios = cms;
          //this.modalService.dismissAll();
        this.toastr.success('bien hecho!', 'Nuevo comercio creado!');}
    )
      
    }
    openFormHorario(modal,comercio){
    this.comercio = comercio;
    this.semana.forEach(d=>{d.check = false});
    this.nuevo_horario = new Horario();
      this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    setDia(event, dia){
      console.log('evento check', event);
    }
    addHorario(){
      this.nuevos_horarios = [];  
      this.semana.forEach(
        d =>{
          this.horario_aux = new Horario();   
          if (d.check){
            this.horario_aux.dia = d.id;
            this.horario_aux.desde = this.nuevo_horario.desde;
            this.horario_aux.hasta = this.nuevo_horario.hasta;
           
            this.horario_aux.comercio_id = this.comercio.id;
  
            this.nuevos_horarios.push(this.horario_aux);
          }
        }
      );
      console.log('nuevos hor',this.nuevos_horarios);
      this.horarioService.saveHorarios(this.nuevos_horarios).subscribe(
        hs => {this.comercio.horarios = hs;
          this.modalService.dismissAll();
          this.toastr.success('bien hecho!', 'Horario/s agregados!');}
      )
    }

    dialogEliminarHorario(element,comer){
      this.comercio = comer;
      this.confirmationDialogService.confirm('Eliminar?', `Esta seguro de eliminar este horario del dia ${element.dia_nombre} ?`)
        .then(
          (confirm) => {(confirm) ? this.eliminarHorario(element) : console.log("cancelado");
                        }
        ).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }

    eliminarHorario(horario){
      
      this.horarioService.deleteHorario(horario).subscribe(
        hs => {this.comercio.horarios = hs;
          this.modalService.dismissAll();
          this.toastr.error('bien hecho!', 'Horario/s eliminado!');}
      )
    }

    openFormFoto(modal,comer){
      this.comercio = comer;
      this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    selectFile(event){
      this.nueva_foto = event.target.files.item(0);
    }
    guardarLogo(){
      this.comercioService.uploadLogo(this.nueva_foto,this.comercio.id).subscribe(
        cms => { //this.tokenService.currentUserData.url_logo= res.url_logo;
                this.modalService.dismissAll();
                this.comercios = cms;
                this.cdRef.detectChanges();
                console.log("enviadooo nueva url: ", this.comercio);
                }
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
