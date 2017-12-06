import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTreeComponent} from './nz-tree.component';
import {TreeModule} from 'angular-tree-component';

@NgModule({
  declarations: [
    NzTreeComponent,
  ],
  imports: [
    CommonModule,
    TreeModule
  ],
  exports: [
    NzTreeComponent
  ],
})
export class NzTreeModule {}
