import { apikey } from './../../../modelos/apikey';
import { Estadosplan } from './../../../modelos/estado-planes';

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
import { ActivatedRoute, Router } from '@angular/router';

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
  default = Comercio.DEFAULT;
  solicitud_pendiente = Comercio.PENDIENTE;
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

  nuevas_fotos: File[]=[];

  file;
  selectedFoto:string;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImages: any[] = [];
  agregarFoto= true;
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
  @ViewChild('modalplan') modalplan: TemplateRef<any>;
  @ViewChild('modaltags') modaltags: TemplateRef<any>;
  @ViewChild('formhorario') formhorario: TemplateRef<any>;
  
  //para hide/show btn cambio plan
  es_pago_mp=false;
  es_servicio_gratuito=true;
  estado_plan: Estadosplan;
  plan_hasta:string;

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
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.checkPayment();
  }

  checkPayment(){
    let status = this.route.snapshot.queryParams["status"];
    let preference_id = this.route.snapshot.queryParams["preference_id"];
    let payment_id = this.route.snapshot.queryParams["payment_id"];

    if (preference_id) {
      if (localStorage.hasOwnProperty('preference_id')) {
        if ((localStorage.getItem('preference_id') === preference_id) && (status==='approved' || status ==='pending')){
          this.comercioplanService.updatePayment(payment_id).subscribe(
            res => {  if (res.status === 'created'){
                        if (status==='approved'){
                          this.toastr.warning('Bien hecho!', 'El cambio esta pendiente, gracias!');
                        }else if (status ==='pending'){
                          this.toastr.warning('Bien hecho!', 'El cambio esta pendiente a que realize el pago, gracias!');
                        }

                      }
            }
          )
        }
        else {
          this.toastr.error('El pago aun NO esta aprobado');
        }
        this.router.navigate([], { queryParams: {}});
      }
    }

    localStorage.removeItem('preference_id');
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
    this.comercio.provincia_id = Provincia.SALTA;

    if (this.provincias.length === 0) {
      this.getProvincias();
    }
    if (this.departamentos.length ===0){
      this.buscarDtos(Provincia.SALTA)
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

  buscarDtos(prov_id) {
    this.provincia_id = prov_id;
    this.ubicacionService.getDptos(this.provincia_id).subscribe(
      dtos => { this.departamentos = dtos; }
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
        //this.openFormTags(this.modaltags, this.comercios[this.comercios.length - 1])
        this.openFormPlan(this.modalplan , this.comercio);
      }
    )
  }

  updateComercio() {
    this.comercioService.updateComercio(this.comercio).subscribe(
      comer => {
        let index = this.comercios.findIndex(c => c.id === this.comercio.id)
        this.comercios[index] = new Comercio(comer);
        this.cdRef.detectChanges();
        this.modalService.dismissAll();
        this.toastr.success('bien hecho!', 'Datos actualizados!');
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
        let index = this.comercios.findIndex(c => c.id === this.comercio.id)
        this.comercios[index] = new Comercio(cms);
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
    this.croppedImages = [];
    this.imageChangedEvent = '';
    this.agregarFoto = true;
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    if (Boolean(this.imageChangedEvent)){
      this.agregarFoto = false;
    }
  }

  addFoto(){
    this.agregarFoto= true;
    this.croppedImages.push(this.croppedImage);
    this.imageChangedEvent='';
    var file = this.dataURLtoFile(this.croppedImage, 'image.png');
    this.nuevas_fotos.push(file);
  }
  removeFoto(i){
    this.croppedImages.splice(i,1);
    this.imageChangedEvent='';
  }

  guardarFoto() {
    this.comercioService.uploadFotos(this.nuevas_fotos, this.comercio.id).subscribe(
      cm => {
        this.modalService.dismissAll();
        let index = this.comercios.findIndex(c => c.id === this.comercio.id)
        this.comercios[index] = new Comercio(cm);
        this.cdRef.detectChanges();
        this.toastr.success('bien hecho!', 'Foto actualizada!');
      }
    )
  }

  removeFotoFromServer(foto,comer){
    console.log("foto a remover",foto[0])
    this.confirmationDialogService.confirm('Eliminar?', `Esta seguro de eliminar este foto ?`)
      .then(
        (confirm) => {
          (confirm) ? this.eliminarFoto(foto,comer) : console.log("cancelado");
        }
      ).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  //Método que elimina la foto del servidor
  eliminarFoto(foto,comer){
    this.comercioService.deleteFoto(foto[0],comer).subscribe(
      comercio => { this.modalService.dismissAll();
                    let index = this.comercios.findIndex(c => c.id === comer.id)
                    this.comercios[index] = new Comercio(comercio);
                    this.toastr.error('Foto eliminada!', 'Foto removida!');
      }
    )
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
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

  //funciones para URL VIDEO
  loadUrlVideo(){

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

  // Funciones para actualizar tipo de plan/servicio
  openFormPlan(modal, comer) {
    this.comercio = comer;
    this.comercioplan = new Comercioplan();
    this.es_pago_mp = false;
    this.comercioplan.comercio_id = this.comercio.id;
    this.comercioplan.tipo_servicio_id = this.comercio.tipo_servicio.id;
    this.comercioplan.tipo_servicio = this.comercio.tipo_servicio;
    this.comercioplan.meses = 1;
    this.es_servicio_gratuito = (this.comercioplan.tipo_servicio_id === 1) ? true : false;
    this.comercioplan.importe = this.comercioplan.meses * this.comercioplan.tipo_servicio.importe;
    this.datosService.getTipoServicios().subscribe(
      res => {
        this.getFormapagos();
        this.servicios = res.map(s => new TipoServicio(s));
        this.servicios = this.servicios.filter(plan => plan.nombre !== 'NUEVO')
        if (!this.creando_new) {
          this.servicios = this.servicios.filter(plan => plan.nombre !== 'GRATUITO')
        }
      }
    )
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  checkFormapago(e){
    this.es_pago_mp = (e === 4) ? true : false;
    if (e === 4){
      this.pagarMercadoPago();
    }
  }

  //FORMA DE PAGOS: GRATUITO, COBRADOR, TRANSFERENCIA BANCARIA.
  updateTipoPlan() {
    this.comercioplan.tipo_servicio_id = this.comercioplan.tipo_servicio.id;
    this.comercioplanService.updateComercioPlan(this.comercioplan).subscribe(
      res => {
        this.es_pago_mp= false;
        this.modalService.dismissAll();
        let index = this.comercios.findIndex(c => c.id === this.comercio.id)
        this.comercios[index] = new Comercio(res);
        this.toastr.success('Bien hecho!', 'El cambio esta pendiente hasta que se confirme el pago!');
        if (this.creando_new) {
          this.openFormTags(this.modaltags, this.comercios[this.comercios.length - 1])
        }
      }
    )
  }

  //FORMA DE PAGO: MERCADO PAGO. CREACION DE BOTON PAGAR.
  pagarMercadoPago() {
    this.comercioplan.tipo_servicio_id = this.comercioplan.tipo_servicio.id;
    this.comercioplanService.solicitudMercadoPago(this.comercioplan).subscribe(
      res => {  this.createCheckoutButton(res['preference_id']);
      }
    )
  }

  createCheckoutButton(preference) {
    var script = document.createElement("script");
    localStorage.setItem('preference_id', preference);
    // The source domain must be completed according to the site for which you are integrating.
    // For example: for Argentina ".com.ar" or for Brazil ".com.br".
    script.src = "https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js";
    script.type = "text/javascript";
    script.dataset.preferenceId = preference;
    document.getElementById("button-checkout").innerHTML = "";
    document.querySelector("#button-checkout").appendChild(script);
  }


  calcularTotalServicio(servicio) {
    this.es_servicio_gratuito = (servicio === 1) ? true : false;
    if (this.es_servicio_gratuito) {
      this.comercioplan.formapago_id=3;
    }else {
      this.comercioplan.formapago_id = undefined;
      this.es_servicio_gratuito = false;
    }
    this.comercioplan.tipo_servicio = this.servicios.find(s => s.id === servicio);
    this.comercioplan.importe = this.comercioplan.meses * this.comercioplan.tipo_servicio.importe;
  }

  calcularTotalMes(mes) {
    this.comercioplan.importe = this.comercioplan.meses * this.comercioplan.tipo_servicio.importe;
  }

  getFormapagos() {
    this.datosService.getFormapagos().subscribe(
      fps => { this.formapagos = fps;
               this.formapagos = this.formapagos.filter(
               formapago => formapago.descripcion !== 'GRATUITO');
              }
    )
  }

  verEstadisticas(modal, comer) {
    this.comercio = comer;
    this.comercio_estadistica = new Comercio();
    this.comercioService.getEstadisticaLinks(this.comercio.id).subscribe(
      est => {
        this.comercio_estadistica = est;
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
