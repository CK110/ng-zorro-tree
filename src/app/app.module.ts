import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {DemoBasicComponent} from '../demo/basic.component';
import {NzTreeModule} from '../components/index';

import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {DemoAsyncComponent} from '../demo/async.component';
import {DemoBasicStrictComponent} from '../demo/basic-strict.component';
import {DemoTreeSelectBasicComponent} from '../demo/treeselect.basic';
import {NzTreeSelectModule} from '../components/tree-select/nz-tree-select.module';
import {DemoTreeSelectStrictBasicComponent} from '../demo/treeselect.basic-strict';
import {DemoTreeSingleSelectBasicComponent} from '../demo/treeselect-single.basic';

@NgModule({
  declarations: [
    AppComponent,
    DemoBasicComponent,
    DemoAsyncComponent,
    DemoBasicStrictComponent,
    DemoTreeSelectBasicComponent,
    DemoTreeSelectStrictBasicComponent,
    DemoTreeSingleSelectBasicComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    NzTreeModule,
    FormsModule,
    HttpClientModule,
    NzTreeSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
