import { ComercioService } from './../../../servicios/comercio.service';
import { Comercio } from './../../../modelos/comercio';
import { Component, OnInit } from '@angular/core';
import { Provincia } from '../../../modelos/provincia';
import { Departamento } from '../../../modelos/departamento';
import { Localidad } from '../../../modelos/localidad';
import { AngularTokenService } from 'angular-token';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UbicacionService } from '../../../servicios/ubicacion.service';
import { RubroService } from '../../../servicios/rubro.service';
import { Rubro } from '../../../modelos/rubro';

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
  constructor( public tokenService: AngularTokenService,
    private modalService: NgbModal,
    private ubicacionService:UbicacionService,
    private rubroService: RubroService,
    private comercioService:ComercioService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.getComercios();
    this.getProvincias();
    this.getRubros();
  }

  getComercios(){
    this.comercioService.getComercios().subscribe(
      cms =>{this.comercios = cms;}
    )
  }
  openFormAgregar(modal){
    this.comercio = new Comercio();
    
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
