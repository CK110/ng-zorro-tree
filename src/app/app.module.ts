import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {DemoAsyncComponent} from '../demo/async.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {DemoBasicComponent} from '../demo/basic.component';
import {DemoOneComponent} from '../demo/deme-one.component';
import {NzTreeModule} from '../components/tree/nz-tree.module';

@NgModule({
  declarations: [
    AppComponent,
    DemoAsyncComponent,
    DemoBasicComponent,
    DemoOneComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    NzTreeModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
