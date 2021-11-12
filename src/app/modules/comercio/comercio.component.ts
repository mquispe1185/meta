import { ViewChild } from '@angular/core';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, ParamMap  } from '@angular/router';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { ModalDismissReasons, NgbCarousel, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularTokenService } from 'angular-token';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ToastrService } from 'ngx-toastr';
import { ComercioService } from 'src/app/servicios/comercio.service';
import { ReferenciaService } from 'src/app/servicios/referencia.service';
import { Comercio } from '../../modelos/comercio';
import { Referencia } from '../../modelos/referencia';


@Component({
  selector: 'app-comercio',
  templateUrl: './comercio.component.html',
  styleUrls: ['./comercio.component.css']
})
export class ComercioComponent implements OnInit {

  comercio:Comercio;
  comercio_id:number;
  lat: number;
  lon:number;
  zoom:number;
  closeResult: string;
  referencia:Referencia;
  referencias:Referencia[]=[];
  restan= 240;
  public faceapp:SafeResourceUrl;
  public safeURL:SafeResourceUrl;
  public safeVideoUrl:SafeResourceUrl;
  imageUrls = [];
  videoUrls = [];
  miniaturas = [];
  @ViewChild('myCarousel') myCarousel: NgbCarousel;

  constructor(private comercioService:ComercioService,
              public tokenService: AngularTokenService,
              private refeService:ReferenciaService,
              private modalService: NgbModal,
              public deviceService: DeviceDetectorService,
              private router: Router,
              private route: ActivatedRoute,
              private sanitizer:DomSanitizer,
              private toastr: ToastrService,
              private cdr: ChangeDetectorRef,) { }

  ngOnInit(): void {
    let comerid = this.route.snapshot.paramMap.get('comercio');
    if(comerid != null){
      this.comercio_id = +comerid;
    }else{
    this.comercio_id = +localStorage.getItem('comercio_id');
    }
    this.comercioService.getComercio(this.comercio_id).subscribe(
      cm =>{this.comercio= new Comercio(cm);
        this.lat = +this.comercio.latitud;
        this.lon = +this.comercio.longitud;
        this.afterComercio();}
    )
  }

  afterComercio(){
    this.comercioService.addVisitaComercio(this.comercio.id).subscribe();
    this.zoom = 16;
    if (this.deviceService.isMobile()){
      this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl('whatsapp://send?phone=+54'+this.comercio.celular);
      if(this.comercio.es_fanpage){
      this.faceapp = this.sanitizer.bypassSecurityTrustResourceUrl('fb://page/'+this.comercio.facebook_id);
      }else{
        this.faceapp = this.sanitizer.bypassSecurityTrustResourceUrl('fb://profile/'+this.comercio.facebook_id);
      }
    }else{
      this.safeURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://web.whatsapp.com/send?phone=54'+this.comercio.celular);
    }
    // Si el Comercio es ESTANDAR o PREMIUM traer Referencias.
    if (this.comercio.show_estandar){
      this.getReferencias();
    }

    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${this.comercio.url_video}`);
    console.log('safe video url',this.safeVideoUrl)
    
    this.comercio.fotos.forEach(f => this.miniaturas.push(f));
    this.miniaturas.push(`https://img.youtube.com/vi/${this.comercio.url_video}/0.jpg`);
  }

  changeFoto(activeId){
    console.log('CHANGE FOTO',activeId.toString());
    this.myCarousel.select(`img${activeId}`);
  }

  getReferencias(){
    this.refeService.getReferencias(this.comercio.id).subscribe(
      refs =>{
                this.referencias = refs;
      }
    )
  }

  crearReferencia(modal){
    if (this.tokenService.currentUserData){
    this.referencia = new Referencia();
    this.referencia.puntaje = 0;
    this.restan = 240;
    this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    }else{
      //console.log('entramos a loguearnos');
      localStorage.setItem('redirect',this.router.url);
      this.tokenService.signInOAuth('google');
    }
  }

  guardarReferencia(){
    this.referencia.comercio_id = this.comercio.id;
    this.refeService.createReferencia(this.referencia).subscribe(
      ref =>{ this.referencias.push(ref);
        this.toastr.success('Gracias!', 'Su comentario ha sido agregado');
        this.modalService.dismissAll();
      }
    )
  }

  contadorChar(event){
    this.restan = 240 - event.length ;
  }

  sumarClick(opcion){
    this.comercioService.addVisitaLinkComercio(opcion, this.comercio.id).subscribe();
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
  // onSelectFile(event) {
  //   const files = event.target.files;
  //   if (files) {
  //     for (const file of files) {
  //       const reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         if (file.type.indexOf("image") > -1) {
  //           this.imageUrls.push(e.target.result);
  //         } else if (file.type.indexOf("video") > -1) {
  //           this.videoUrls.push(e.target.result);
  //         }
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   }
  // }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

}
