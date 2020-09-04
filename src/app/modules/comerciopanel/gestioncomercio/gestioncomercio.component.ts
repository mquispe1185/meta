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
import { ImageCroppedEvent } from 'ngx-image-cropper';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
export interface Palabras {
  //utilizado para las palabras claves
  clave: string;
}

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

  file;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  //variables para el manejo de palabras claves
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  palabras: Palabras[] =[];

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

    onFileChange(event) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.file = file;
      }
    }
  
    fileChangeEvent(event: any): void {
      console.log(event);
      this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
  
      //Usage example:
      var file = this.dataURLtoFile(this.croppedImage,'image.png');
      console.log(file);
      this.nueva_foto = file;
    }
  
    dataURLtoFile(dataurl, filename) {
   
        let arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), 
            n = bstr.length, 
            u8arr = new Uint8Array(n);
            
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new File([u8arr], filename, {type:mime});
    }
      
      
    imageLoaded() {
      // show cropper
    }
    cropperReady() {
      // cropper ready
    }
    loadImageFailed() {
      // show message
    }

    //funciones de PALABRA CLAVE

    openFormTags(modal,comer){
      this.comercio = comer;
      this.palabras = [];
      if (this.comercio.tags != null){
      let ps = this.comercio.tags.split(' ');
      ps.forEach( c=>{ this.palabras.push({clave: c})})
      }
      this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    add(event: MatChipInputEvent): void {
      const input = event.input;
      const value = event.value;
  
      // Add our fruit
      if ((value || '').trim()) {
        this.palabras.push({clave: value.trim()});
      }
  
      // Reset the input value
      if (input) {
        input.value = '';
      }
      console.log('agregadoss',this.palabras);
    }
  
    remove(clave: Palabras): void {
      const index = this.palabras.indexOf(clave);
  
      if (index >= 0) {
        this.palabras.splice(index, 1);
      }
    }

    guardarTags(){
      var palabrasclaves = '';
      this.palabras.forEach( p =>{
        if (palabrasclaves.length > 0){
        palabrasclaves = palabrasclaves+' '+p.clave;
        }else{
          palabrasclaves = p.clave;
        }
      })
      this.comercio.tags = palabrasclaves;
     this.updateComercio();
      console.log('mis tags',palabrasclaves);
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
