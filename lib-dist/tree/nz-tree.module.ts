import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTreeComponent} from './nz-tree.component';
import {TreeModule} from 'angular-tree-component';
import {NzTreeService} from '../providers/nz-tree.service';

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
  providers:[
    NzTreeService
  ]
})
export class NzTreeModule {}
