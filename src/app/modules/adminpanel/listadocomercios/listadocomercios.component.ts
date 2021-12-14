import { ComercioService } from './../../../servicios/comercio.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Router} from '@angular/router';

@Component({
  selector: 'app-listadocomercios',
  templateUrl: './listadocomercios.component.html',
  styleUrls: ['./listadocomercios.component.css']
})
export class ListadocomerciosComponent implements OnInit {

  lstComercios: any;
  aux_comercios: Comercio[];
  dspCol: string[] = ['nombre', 'rubro', 'usuario', 'domicilio', 'tiposervicio', 'acciones'];
  @ViewChild(MatPaginator) paginatorCom: MatPaginator;
  comercioSelected: Comercio = new Comercio();
  rubros: Rubro[] = [];
  semana = Semana.semana;
  closeResult: string;
  horarios: Horario[] = [];
  nuevos_horarios: Horario[] = [];
  nuevo_horario: Horario;
  horario_aux: Horario;

  comercio: Comercio;
  comercios: Comercio[] = [];
  nueva_foto: File;
  nuevas_fotos: File[] = [];
  file;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  croppedImages: any[] = [];
  agregarFoto= true;

  constructor(public tokenService: AngularTokenService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private confirmationDialogService: ConfirmationDialogService,
    private horarioService: HorarioService,
    private rubroService: RubroService,
    private comercioService: ComercioService,
    private cdRef: ChangeDetectorRef,
    public router: Router) { }

  ngOnInit(): void {
    this.tokenService.validateToken().subscribe(
      res => { this.getComercios(); }
    );

  }

  getComercios() {
    this.comercioService.getComercios().subscribe(
      cms => {
        this.aux_comercios = cms.map(c => new Comercio(c));
        this.lstComercios = new MatTableDataSource(this.aux_comercios);
        this.lstComercios.paginator = this.paginatorCom;
      }
    )
  }

  filtrarComercios(term) {
    this.lstComercios.filter = term.trim().toLowerCase();
  }

  verComercio(comer){
    localStorage.removeItem('comercio_id');
    localStorage.setItem('comercio_id',comer);
    this.router.navigate(['comercio',comer]);
  }

  dialogAprobarComercio(element) {
    var msj = '';
    var tit = '';
    if (element.habilitado) {
      tit = 'Deshablitar';
      msj = `Deshabilitar al comercio ${element.nombre} ?`;
    } else {
      tit = 'Habilitar';
      msj = `Aprobar al comercio ${element.nombre} ?`;
    }
    this.confirmationDialogService.confirm(tit, msj)
      .then(
        (confirm) => {
          (confirm) ? this.aprobarComercio(element) : console.log("cancelado");
        }
      ).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }

  aprobarComercio(element) {
    //element.habilitado = !element.habilitado;
    this.comercioService.habilitarComercio(element.id).subscribe(
      cms => {
        this.lstComercios = new MatTableDataSource(cms.map(c => new Comercio(c)));

        this.lstComercios.paginator = this.paginatorCom;
        this.toastr.success('Estado actualizado correctamente!', 'Actualizado!');
      }
    )
  }

  openFormEditar(modal, comer) {
    this.comercioSelected = new Comercio(comer);
    if (this.rubros.length === 0) {
      this.getRubros();
    }
    this.modalService.open(modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  updateComercio() {
    this.comercioService.updateComercio(this.comercioSelected).subscribe(
      comer => {
        let index = this.aux_comercios.findIndex(c => c.id === this.comercioSelected.id)
        this.aux_comercios[index] = new Comercio(comer);
        this.lstComercios = new MatTableDataSource(this.aux_comercios);
        this.cdRef.detectChanges();
        this.modalService.dismissAll();
        this.toastr.success('Bien Hecho!', 'Datos actualizados!');
      }
    )
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
        let index = this.aux_comercios.findIndex(p => p.id === element.id);
        this.aux_comercios.splice(index, 1);
        this.lstComercios = new MatTableDataSource(this.aux_comercios);
        this.lstComercios.paginator = this.paginatorCom;
        this.toastr.error('Eiminado!', 'Comercio eliminado!');
      }
    )
  }


  openFormInfo(modal, element) {
    this.comercioSelected = { ...element };
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

  //Gestion de horarios
  openFormHorario(modal, comercio) {
    this.comercioSelected = { ...comercio };
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

          this.horario_aux.comercio_id = this.comercioSelected.id;

          this.nuevos_horarios.push(this.horario_aux);
        }
      }
    );

    this.horarioService.saveHorarios(this.nuevos_horarios).subscribe(
      hs => {
        this.comercioSelected.horarios = hs;
        this.modalService.dismissAll();
        this.toastr.success('bien hecho!', 'Horario/s agregados!');
      }
    )
  }
  dialogEliminarHorario(element) {
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
        this.modalService.dismissAll();
        this.toastr.error('bien hecho!', 'Horario/s eliminado!');
      }
    )
  }

  //Gestion de Imagen
  /*     openFormImagen(modal, comer) {
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
        console.log("comerciooo",this.comercio)
        this.comercioService.uploadFotos(this.nuevas_fotos, this.comercio.id).subscribe(
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
      } */

  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
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
    if (Boolean(this.imageChangedEvent)) {
      this.agregarFoto = false;
    }
  }

  addFoto() {
    this.agregarFoto = true;
    this.croppedImages.push(this.croppedImage);
    this.imageChangedEvent = '';
    var file = this.dataURLtoFile(this.croppedImage, 'image.png');
    this.nuevas_fotos.push(file);
  }
  removeFoto(i) {
    this.croppedImages.splice(i, 1);
    this.imageChangedEvent = '';
  }

  guardarFoto() {
    this.comercioService.uploadFotos(this.nuevas_fotos, this.comercio.id).subscribe(
      cm => {
        this.modalService.dismissAll();
        let index = this.aux_comercios.findIndex(c => c.id === this.comercio.id)
        this.aux_comercios[index] = new Comercio(cm);
        this.lstComercios = new MatTableDataSource(this.aux_comercios);
        this.cdRef.detectChanges();
        this.toastr.success('bien hecho!', 'Foto actualizada!');
      }
    )
  }

  removeFotoFromServer(foto, comer) {
    console.log("foto a remover", foto[0])
    this.confirmationDialogService.confirm('Eliminar?', `Esta seguro de eliminar este foto ?`)
      .then(
        (confirm) => {
          (confirm) ? this.eliminarFoto(foto, comer) : console.log("cancelado");
        }
      ).catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  //Método que elimina la foto del servidor
  eliminarFoto(foto, comer) {
    this.comercioService.deleteFoto(foto[0], comer).subscribe(
      cm => {
        this.modalService.dismissAll();
        let index = this.aux_comercios.findIndex(c => c.id === comer.id)
        this.aux_comercios[index] = new Comercio(cm);
        this.lstComercios = new MatTableDataSource(this.aux_comercios);
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

  //Método para cerrar Modal con Tecla Escape.
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
