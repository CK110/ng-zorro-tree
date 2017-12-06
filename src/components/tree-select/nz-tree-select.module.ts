import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {NzTreeSelectComponent} from './nz-tree-select.component';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {NzTreeModule} from '../tree/nz-tree.module';
import { OverlayModule } from '@angular/cdk/overlay';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    NzTreeSelectComponent
  ],
  imports: [
    CommonModule,
    NgZorroAntdModule,
    NzTreeModule,
    OverlayModule,
    FormsModule
  ],
  exports: [
    NzTreeSelectComponent
  ]
})
export class NzTreeSelectModule {}
