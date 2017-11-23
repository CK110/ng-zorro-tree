import { Component } from '@angular/core';
import {NODES} from './constant';

@Component({
  selector: 'demo-basic',
  template: `
  <h2>支持复选的树状结构</h2>
  <nz-tree [nzNodes]="nodes"
           [nzCheckable]="true"
           [nzShowLine]="true"
           [nzNodeKeys]="nodeKeys"
           (nzActivate)="onEvent1($event)"
           (nzEvent)="onEvent($event)"></nz-tree>
  `
})
export class DemoBasicComponent {

  nodeKeys={
    'pid':'zpid',
    'id':'zid',
    'name':'zname',
    'checked':'zchecked',
    'disableCheckbox':'zdisableCheckbox',
  };
  nodes = [];

  ngOnInit() {
    this.nodes= NODES;
    console.log(this.nodes);
  }

  onEvent(ev: any) {
    console.log('basic', 'onEvent', ev);
  }

  onEvent1(ev: any) {
    console.log('basic222', 'onEvent', ev);
  }
}
