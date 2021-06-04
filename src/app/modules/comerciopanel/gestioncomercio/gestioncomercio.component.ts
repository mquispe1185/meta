
import { Formapago } from './../../../modelos/formapago';
import { Comercioplan } from './../../../modelos/comercioplan';
import { TipoServicio } from './../../../modelos/tipo-servicio';
import { Promocion } from './../../../modelos/promocion';
import { HorarioService } from './../../../servicios/horario.service';
import { Semana } from './../../../modelos/semana';
import { ComercioService } from './../../../servicios/comercio.service';
import { ComercioplanService } from './../../../servicios/comercioplan.service';
import { Comercio } from './../../../modelos/comercio';
import { Component, OnInit, NgZone, ElementRef, ViewChild, ChangeDetectorRef, TemplateRef } from '@angular/core';
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
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { DatosService } from '../../../servicios/datos.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  comercio: Comercio;
  provincias: Provincia[] = [];
  departamentos: Departamento[] = [];
  provincia_id: number;
  depatramento_id: number;
  localidades: Localidad[] = [];
  rubros: Rubro[] = [];
  comercios: Comercio[] = [];
  semana = Semana.semana;
  horarios: Horario[] = [];
  nuevos_horarios: Horario[] = [];
  nuevo_horario: Horario;
  horario_aux: Horario;

  nueva_foto: File;

  file;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  msjenvio;

  //variables para el manejo de palabras claves
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  palabras: Palabras[] = [];

  //actualizar tipo servicios
  comercioplan: Comercioplan = new Comercioplan();
  servicios: TipoServicio[];
  formapagos: Formapago[];
  meses = Semana.meses;
  selected: TipoServicio;

  creando_new = false;
  //para mostrar estadisticas
  comercio_estadistica: Comercio;
  @ViewChild('modaltags') modaltags: TemplateRef<any>;
  @ViewChild('formhorario') formhorario: TemplateRef<any>;

  //para hide/show btn cambio plan
  cambio_solicitado=false;
  constructor(public tokenService: AngularTokenService,
    private modalService: NgbModal,
    private ubicacionService: UbicacionService,
    private rubroService: RubroService,
    private comercioService: ComercioService,
    private comercioplanService: ComercioplanService,
    private horarioService: HorarioService,
    private cdRef: ChangeDetectorRef,
    private confirmationDialogService: ConfirmationDialogService,
    private datosService: DatosService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.getComercios();
  }

  getComercios() {
    this.comercios = []
    this.comercioService.getMisComercios().subscribe(
      cms => {
        this.comercios = cms.map(c => new Comercio(c));
        localStorage.setItem('miscomercios', JSON.stringify(this.comercios));
      }
    )
  }


  openFormAgregar(modal) {
    this.comercio = new Comercio();
    this.creando_new = true;
    this.comercio.envio = false;

    if (this.provincias.length === 0) {
      this.getProvincias();
    }
    if (this.rubros.length === 0) {
      this.getRubros();
    }
    this.msjenvio = 'Delivery: NO';
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openFormEditarComercio(modal, comer) {
    this.comercio = comer;
    if (this.comercio.envio) {
      this.msjenvio = 'Delivery: SI';
    } else {
      this.msjenvio = 'Delivery: NO';
    }

    if (this.provincias.length === 0) {
      this.getProvincias();
    }
    if (this.rubros.length === 0) {
      this.getRubros();
    }
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getRubros() {
    this.rubroService.getRubros().subscribe(
      rs => {
        this.rubros = rs;
      }
    );
  }
  getProvincias() {
    this.ubicacionService.getProvincias().subscribe(
      provs => {
        this.provincias = provs;
      }
    )
  }

  buscarDtos(event) {
    this.provincia_id = event.value;
    this.ubicacionService.getDptos(this.provincia_id).subscribe(
      dtos => { this.departamentos = dtos; console.log('deptos', dtos); }
    )
  }

  buscarLocs(event) {
    this.depatramento_id = event.value;
    this.ubicacionService.getLocalidad(this.depatramento_id).subscribe(
      locs => { this.localidades = locs }
    )
  }

  cambiarTextoEnvio(e) {
    if (e.checked) {
      this.msjenvio = 'Delivery SI';
    } else {
      this.msjenvio = 'Delivery NO';
    }
  }

  altaComercio() {
    this.creando_new = true;
    this.comercioService.createComercio(this.comercio).subscribe(
      cms => {
        this.comercio = new Comercio(cms)
        this.comercios.push(this.comercio);
        this.modalService.dismissAll();
        this.toastr.success('bien hecho!', 'Nuevo comercio creado!');
        this.openFormTags(this.modaltags, this.comercios[this.comercios.length - 1])
      }
    )
  }

  updateComercio() {
    this.comercioService.updateComercio(this.comercio).subscribe(
      cms => {
        this.comercios = cms.map(c => new Comercio(c));
        this.modalService.dismissAll();
        this.toastr.success('bien hecho!', 'Datos actualizados!');
        console.log('crean new en update', this.creando_new);
        if (this.creando_new) {
          this.openFormHorario(this.formhorario, this.comercio)
        }
      }
    )
  }

  openFormAgregarUbicacion(element) {
    const modalRefCity = this.modalService.open(ModalGooglePlacesComponent);
    modalRefCity.componentInstance.comercio = element;
    modalRefCity.componentInstance.creando_new = this.creando_new;
    modalRefCity.componentInstance.comercioevent.subscribe(($e) => {
      this.actualizarUbicacion($e);
      this.modalService.dismissAll();
    })
  }

  actualizarUbicacion(comercio) {
    this.comercioService.updateComercio(comercio).subscribe(
      cms => {
        this.comercios = cms.map(c => new Comercio(c));
        //this.modalService.dismissAll();
        this.creando_new = false;
        this.toastr.success('bien hecho!', 'Ubicación actualizada!');
      }
    )
  }

  openFormHorario(modal, comercio) {
    this.comercio = comercio;
    this.semana.forEach(d => { d.check = false });
    this.nuevo_horario = new Horario();
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  setDia(event, dia) {
  }
  addHorario() {
    this.nuevos_horarios = [];
    this.semana.forEach(
      d => {
        this.horario_aux = new Horario();
        if (d.check) {
          this.horario_aux.dia = d.id;
          this.horario_aux.desde = this.nuevo_horario.desde;
          this.horario_aux.hasta = this.nuevo_horario.hasta;
          this.horario_aux.comercio_id = this.comercio.id;
          this.nuevos_horarios.push(this.horario_aux);
        }
      }
    );

    this.horarioService.saveHorarios(this.nuevos_horarios).subscribe(
      hs => {
        this.comercio.horarios = hs;
        this.modalService.dismissAll();
        this.toastr.success('bien hecho!', 'Horario/s agregados!');
        if (this.creando_new) {
          this.openFormAgregarUbicacion(this.comercio)
        }
      }
    )
  }

  dialogEliminarHorario(element, comer) {
    this.comercio = comer;
    this.confirmationDialogService.confirm('Eliminar?', `Esta seguro de eliminar este horario del dia ${element.dia_nombre} ?`)
      .then(
        (confirm) => {
          (confirm) ? this.eliminarHorario(element) : console.log("cancelado");
        }
      ).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  eliminarHorario(horario) {

    this.horarioService.deleteHorario(horario).subscribe(
      hs => {
        this.comercio.horarios = hs;
        this.modalService.dismissAll();
        this.toastr.error('bien hecho!', 'Horario/s eliminado!');
      }
    )
  }

  openFormFoto(modal, comer) {
    this.comercio = comer;
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  selectFile(event) {
    this.nueva_foto = event.target.files.item(0);
  }
  guardarLogo() {
    this.comercioService.uploadLogo(this.nueva_foto, this.comercio.id).subscribe(
      cms => { //this.tokenService.currentUserData.url_logo= res.url_logo;
        this.modalService.dismissAll();
        this.comercios = cms.map(c => new Comercio(c));
        this.cdRef.detectChanges();
        this.toastr.success('bien hecho!', 'Foto actualizada!');
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
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    //Usage example:
    var file = this.dataURLtoFile(this.croppedImage, 'image.png');
    this.nueva_foto = file;
  }

  dataURLtoFile(dataurl, filename) {
    let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
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
  openFormTags(modal, comer) {
    this.comercio = comer;
    this.palabras = [];
    if (this.comercio.tags != null) {
      let ps = this.comercio.tags.split(' ');
      ps.forEach(c => { this.palabras.push({ clave: c }) })
    }
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  //agregado o quita de tags
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.palabras.push({ clave: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(clave: Palabras): void {
    const index = this.palabras.indexOf(clave);

    if (index >= 0) {
      this.palabras.splice(index, 1);
    }
  }

  guardarTags() {
    var palabrasclaves = '';
    this.palabras.forEach(p => {
      if (palabrasclaves.length > 0) {
        palabrasclaves = palabrasclaves + ' ' + p.clave;
      } else {
        palabrasclaves = p.clave;
      }
    })
    this.comercio.tags = palabrasclaves;
    this.updateComercio();
  }









  // funciones para actualizar tipo de plan/servicio
  openFormPlan(modal, comer) {
    this.comercio = comer;
    console.log('tipo plan',comer)
    this.comercioplan.comercio_id = this.comercio.id;
    this.comercioplan.tipo_servicio_id = this.comercio.tipo_servicio.id;
    this.comercioplan.tipo_servicio = this.comercio.tipo_servicio;
    this.comercioplan.meses = 1;

    this.comercioplan.importe = this.comercioplan.meses * this.comercioplan.tipo_servicio.importe;
    this.datosService.getTipoServicios().subscribe(
      res => {
        this.getFormapagos();
        this.servicios = res.map(s => new TipoServicio(s));
      }
    )
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  updateTipoPlan() {
    this.comercioplan.tipo_servicio_id = this.comercioplan.tipo_servicio.id;
    this.comercioplanService.updateComercioPlan(this.comercioplan).subscribe(
      res => { console.log("res cambio plan",res['preference_id']);
        this.cambio_solicitado= true;
        this.modalService.dismissAll();
        let index = this.comercios.findIndex(c => c.id === this.comercio.id)
        this.comercios[index] = new Comercio(res);
        //this.createCheckoutButton(res['preference_id'])
        this.toastr.warning('Bien hecho!', 'El cambio esta pendiente hasta que se confirme el pago!');
      }
    )
  }

  createCheckoutButton(preference) {
    var script = document.createElement("script");
    
    // The source domain must be completed according to the site for which you are integrating.
    // For example: for Argentina ".com.ar" or for Brazil ".com.br".
    script.src = "https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js";
    script.type = "text/javascript";
    script.dataset.preferenceId = preference;
    document.getElementById("button-checkout").innerHTML = "";
    document.querySelector("#button-checkout").appendChild(script);
  }


  calcularTotalServicio(servicio) {
    this.comercioplan.tipo_servicio = this.servicios.find(s => s.id === servicio);
    this.comercioplan.importe = this.comercioplan.meses * this.comercioplan.tipo_servicio.importe;
  }

  calcularTotalMes(mes) {
    this.comercioplan.importe = this.comercioplan.meses * this.comercioplan.tipo_servicio.importe;
  }

  getFormapagos() {
    this.datosService.getFormapagos().subscribe(
      fps => { this.formapagos = fps; }
    )
  }

  verEstadisticas(modal, comer) {
    this.comercio = comer;
    this.comercio_estadistica = new Comercio();
    this.comercioService.getEstadisticaLinks(this.comercio.id).subscribe(
      est => {
        this.comercio_estadistica = est;
        console.log("daatos estadistica", est);
      }
    )
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  //ayuda para face
  helpFace(modal) {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  helpIg(modal) {
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  dialogEliminarComercio(element) {
    this.confirmationDialogService.confirm('Eliminar?', `Esta seguro de eliminar al comercio ${element.nombre} ?`)
      .then(
        (confirm) => {
          (confirm) ? this.eliminarComercio(element) : console.log("cancelado");
        }
      ).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  eliminarComercio(element) {
    element.activo = false;

    this.comercioService.deleteComercio(element).subscribe(
      cms => {
        let index = this.comercios.findIndex(p => p.id === element.id);
        this.comercios.splice(index, 1);
        this.toastr.error('Eiminado!', 'Comercio eliminado!');
      }
    )
  }

  //Método para cerrar Modal con Tecla Escape.
  private getDismissReason(reason: any): string {
    //this.creando_new = false;
    if (reason === ModalDismissReasons.ESC) {
      this.creando_new = false;
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.creando_new = false;
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
