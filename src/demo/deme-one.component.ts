import { Component } from '@angular/core';
import {KEYS, lazyloadNode, NODES} from './constant';

@Component({
  selector: 'demo-one',
  template: `
    
    <button (click)="demo()">777777</button>
    
    <nz-treeselect *ngIf="flag" [nzTreeData]="treeData" [nzTreeKeys]="treeDataKeys" [(state)]="state"></nz-treeselect>
  `
})
export class DemoOneComponent {
  treeData:any = NODES;
  treeDataKeys=KEYS;

  state:any;

  flag=true;

  constructor(){

  }

  ngOnInit() {

  }

  demo(){
    this.flag= !this.flag;
  }

}
