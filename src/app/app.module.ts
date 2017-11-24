import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {DemoAsyncComponent} from '../demo/async.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {DemoBasicComponent} from '../demo/basic.component';
import {DemoOneComponent} from '../demo/deme-one.component';
import {NzTreeModule} from '../components/tree/nz-tree.module';
import {NzTreeSelectModule} from '../components/select-tree/nz-tree-select.module';
import {DemoTreeSelectSyncComponent} from '../demo/treeselect.async';
import {DemoTreeSelectBasicComponent} from '../demo/treeselect.basic';

@NgModule({
  declarations: [
    AppComponent,
    DemoAsyncComponent,
    DemoBasicComponent,
    DemoOneComponent,
    DemoTreeSelectSyncComponent,
    DemoTreeSelectBasicComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    NzTreeModule,
    NzTreeSelectModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
