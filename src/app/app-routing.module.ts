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

const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
 /*  { path: 'login', component: FooterComponent,
  children: [
    { path: '', component: InicioComponent },
  ] }, */
  { path: 'login', component: InicioComponent,
  },
  { path: 'redirect', component: AfterloginComponent},
  {
    path:'adminpanel',
    component: HeaderComponent,
    loadChildren: () => AdminpanelModule, canLoad: [AdminGuardService]
  },
  {
    path:'comerciopanel',
    component: HeaderComponent,
    loadChildren: () => ComerciopanelModule, canLoad: [GuardService]
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
