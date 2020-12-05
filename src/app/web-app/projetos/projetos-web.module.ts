import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";

import { ProjetosComponent } from './projetos.component';

const ROUTES: Routes = [
  { path: '', component: ProjetosComponent }
]

@NgModule({
  declarations: [
    ProjetosComponent
  ],
  exports: [
    ProjetosComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
  ]
})
export class ProjetosWebModule { }
