import { GestionPlanesComponent } from './modules/adminpanel/gestion-planes/gestion-planes.component';
import { PolPrivacidadComponent } from './inicio/pol-privacidad/pol-privacidad.component';
import { PolServicioComponent } from './inicio/pol-servicio/pol-servicio.component';
import { ComercioComponent } from './modules/comercio/comercio.component';
import { ComerciopanelComponent } from './modules/comerciopanel/comerciopanel.component';
import { GestionPromosComponent } from './modules/comerciopanel/gestion-promos/gestion-promos.component';
import { ComerciopanelModule } from './modules/comerciopanel/comerciopanel.module';
import { AfterloginComponent } from './inicio/afterlogin/afterlogin.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { HeaderComponent } from './inicio/header/header.component';
import { AdminpanelModule } from './modules/adminpanel/adminpanel.module';
import { AngularTokenService } from 'angular-token';
import { GuardService } from './servicios/guard.service';
import { AdminGuardService } from './servicios/admin-guard.service';
import { ComercioModule } from './modules/comercio/comercio.module';
import { QuienesComponent } from './modules/comercio/quienes/quienes.component';
import { ListadocomerciosComponent } from './modules/adminpanel/listadocomercios/listadocomercios.component';
import { ListadopromosComponent } from './modules/adminpanel/listadopromos/listadopromos.component';
import { AdminpanelComponent } from './modules/adminpanel/adminpanel.component';
import { PregFrecuentesComponent } from './inicio/preg-frecuentes/preg-frecuentes.component';
import { ContactateComponent } from './inicio/contactate/contactate.component';

const routes: Routes = [

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
 /*  { path: 'login', component: FooterComponent,
  children: [
    { path: '', component: InicioComponent },
  ] }, */
  { path: 'inicio', component: InicioComponent,
  },
  { path: 'redirect', component: AfterloginComponent},
  { path: 'politica_uso', component: PolServicioComponent},
  { path: 'politica_privacidad', component: PolPrivacidadComponent},
  { path: 'preg-frecuentes', component: PregFrecuentesComponent},
  { path: 'consulta', component: ContactateComponent},
  {
    path:'adminpanel',
    component: AdminpanelComponent,
    loadChildren: () => AdminpanelModule, canLoad: [AdminGuardService]
  },
  {
    path:'comerciopanel',
    component: ComerciopanelComponent,
    //loadChildren: () => ComerciopanelModule, canLoad: [GuardService]
    loadChildren: () => ComerciopanelModule
  },
  {
    path:'comercio/:comercio',
    component: ComercioComponent,
    loadChildren: () => ComercioModule
  },
  {
    path:'quienes-somos',
    component: QuienesComponent,
    loadChildren: () => ComercioModule
  },
  {
    path:'listacomercios',
    component: ListadocomerciosComponent,
    loadChildren: () => AdminpanelModule
  },
  // {
  //   path:'mispromos',
  //   component: GestionPromosComponent,
  //   loadChildren: () => ComerciopanelModule
  // },
  {
    path:'listapromos',
    component: ListadopromosComponent,
    loadChildren: () => AdminpanelModule
  },
  {
    path:'gestion-planes',
    component: GestionPlanesComponent,
    loadChildren: () => AdminpanelModule
  },
  /*{
    path:'estadisticas',
    component: HeaderComponent,
   loadChildren: './modules/estadisticas/estadisticas.module#EstadisticasModule',
  },
  {
    path:'contactos',
    component: HeaderComponent,
   loadChildren: './modules/contactos/contactos.module#ContactosModule',
  }, */
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
