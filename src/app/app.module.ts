import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {DemoAsyncComponent} from '../demo/async.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {DemoBasicComponent} from '../demo/basic.component';
import {NzTreeModule,NzTreeSelectModule} from '../components/index';
import {DemoTreeSelectSyncComponent} from '../demo/treeselect.async';
import {DemoTreeSelectBasicComponent} from '../demo/treeselect.basic';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    DemoAsyncComponent,
    DemoBasicComponent,
    DemoTreeSelectSyncComponent,
    DemoTreeSelectBasicComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    NzTreeModule,
    NzTreeSelectModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
