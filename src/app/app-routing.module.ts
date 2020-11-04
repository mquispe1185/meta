import { ComerciopanelComponent } from './modules/comerciopanel/comerciopanel.component';
import { GestionPromosComponent } from './modules/comerciopanel/gestion-promos/gestion-promos.component';
import { ComerciopanelModule } from './modules/comerciopanel/comerciopanel.module';
import { AfterloginComponent } from './inicio/afterlogin/afterlogin.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FooterComponent } from './inicio/footer/footer.component';
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

const routes: Routes = [

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
 /*  { path: 'login', component: FooterComponent,
  children: [
    { path: '', component: InicioComponent },
  ] }, */
  { path: 'inicio', component: InicioComponent,
  },
  { path: 'redirect', component: AfterloginComponent},
  {
    path:'adminpanel',
    component: HeaderComponent,
    loadChildren: () => AdminpanelModule, canLoad: [AdminGuardService]
  },
  {
    path:'comerciopanel',
    component: ComerciopanelComponent,
    loadChildren: () => ComerciopanelModule, canLoad: [GuardService]
  },
  {
    path:'comercio',
    component: HeaderComponent,
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
  {
    path:'mispromos',
    component: GestionPromosComponent,
    loadChildren: () => ComerciopanelModule
  },
  {
    path:'listapromos',
    component: ListadopromosComponent,
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
