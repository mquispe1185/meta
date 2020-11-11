import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FooterVisitantesComponent } from 'src/app/inicio/footer-visitantes/footer-visitantes.component';
import { ComercioComponent } from './comercio.component';
import { QuienesComponent } from './quienes/quienes.component';

const routes: Routes = [
  {
    path:'',
    component: ComercioComponent,
  },

  {
    path:'quienes',
  component: QuienesComponent,
},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComercioRoutingModule { }
