import { Component } from '@angular/core';
import {KEYS, lazyloadNode, NODES} from './constant';

@Component({
  selector: 'demo-treeselect-basic',
  template: `
    <h2>支持复选的树状结构</h2>
    
    <nz-treeselect 
                   [nzTreeData]="treeData" 
                   [nzTreeKeys]="treeDataKeys" 
                   [nzOptions]="options" 
                   [nzLazyLoad]=false
                   [(state)]="state"
                   [(ngModel)]="m"
    ></nz-treeselect >
    
    <br>
    mmm:{{ m | json }}
  `
})
export class DemoTreeSelectBasicComponent {

  m:any;

  treeData:any = NODES;
  treeDataKeys=KEYS;

  state:any;


  constructor(){

  }

}
