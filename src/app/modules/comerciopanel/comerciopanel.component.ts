import { UbicacionService } from './../../servicios/ubicacion.service';
import { Component, OnInit } from '@angular/core';
import { AngularTokenService } from 'angular-token';
import { Usuario } from '../../modelos/usuario';
import { UsuariosService } from '../../servicios/usuarios.service';
import { Provincia } from '../../modelos/provincia';
import { Departamento } from '../../modelos/departamento';
import { Localidad } from '../../modelos/localidad';

@Component({
  selector: 'app-comerciopanel',
  templateUrl: './comerciopanel.component.html',
  styleUrls: ['./comerciopanel.component.css']
})
export class ComerciopanelComponent implements OnInit {

  usuario:Usuario = new Usuario();
  closeResult: string;

  provincias:Provincia[]=[];
  departamentos:Departamento[]=[];
  provincia_id:number;
  depatramento_id:number;
  localidades:Localidad[]=[];
  en_espera:boolean = false;
  constructor(public tokenService: AngularTokenService,
              private usuarioService: UsuariosService,
              private ubicacionService:UbicacionService) { }

  ngOnInit(): void {
    this.tokenService.validateToken().subscribe(
      res => {this.getUsuario();
              this.getProvincias();} 
    )
  }

  getUsuario(){
    this.usuarioService.getUsuario(this.tokenService.currentUserData.id).subscribe(
      us => { this.usuario = us}
    )
  }
  altaUsuario(){
    this.usuarioService.updateUsuario(this.usuario).subscribe(
      usr => { this.usuario = usr;
              }
    )
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

  buscarDtosEdit(provincia_id){
   
    this.provincia_id = provincia_id;
    this.ubicacionService.getDptos(this.provincia_id).subscribe(
      dtos => { this.departamentos = dtos; this.buscarLocsEdit(this.usuario.departamento_id);}
    )
  }

  buscarLocs(event){
    this.depatramento_id = event.value;
    this.ubicacionService.getLocalidad(this.depatramento_id).subscribe(
      locs => {this.localidades = locs}
    )
  }

  buscarLocsEdit(dto_id){
    this.depatramento_id = dto_id;
    this.ubicacionService.getLocalidad(this.depatramento_id).subscribe(
      locs => {this.localidades = locs}
    )
  }
}
