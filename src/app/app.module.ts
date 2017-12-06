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

@NgModule({
  declarations: [
    AppComponent,
    DemoBasicComponent,
    DemoAsyncComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    NzTreeModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
