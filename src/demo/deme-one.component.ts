import { Component } from '@angular/core';
import {KEYS, lazyloadNode, NODES} from './constant';

@Component({
  selector: 'demo-one',
  template: `
    <nz-treeselect [nzTreeData]="treeData" [nzTreeKeys]="treeDataKeys"></nz-treeselect>
  `
})
export class DemoOneComponent {
  treeData:any = NODES;
  treeDataKeys=KEYS;

  constructor(){

  }

  ngOnInit() {

  }

}
