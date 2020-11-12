import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
