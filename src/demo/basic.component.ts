import { Component } from '@angular/core';
import {NODES} from './constant';

@Component({
  selector: 'demo-basic',
  template: `
  <h2>普通</h2>
  {{selected | json}}
  
  <nz-tree [nzNodes]="nodes"
           [nzCheckable]="true"
           [nzShowLine]="false"
           [nzNodeKeys]="nodeKeys"
           [(ngModel)]="selected"
           [nzCheckStrictly]="false"
           (nzEvent)="onEvent($event)"></nz-tree>
    
  `
})
export class DemoBasicComponent {
  selected=['1','3111'];

  nodeKeys={
    'pid':'zpid',
    'id':'zid',
    'name':'zname',
  };
  nodes = [];

  ngOnInit() {
    this.nodes= NODES;
    console.log(this.nodes);
  }

  onEvent(ev: any) {
    // console.log('basic', 'onEvent', ev);
  }

}
