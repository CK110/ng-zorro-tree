import {Component, ViewChild} from '@angular/core';
import {KEYS, NODES, SELECTEDNODES} from './constant';
import {NzTreeSelectComponent} from '../components/tree-select/nz-tree-select.component';

@Component({
  selector: 'demo-treeselect-basic-strict',
  template: `    
    <h2>多选(nzTreeCheckStrictly)</h2>

    <nz-treeselect
      [nzTreeData]="treeData"
      [nzTreeKeys]="treeDataKeys"
      [nzOptions]="options"
      [nzLazyLoad]=false
      [nzCheckable]="true"
      [(ngModel)]="selectNodes"
      [nzTreeCheckStrictly]="true"
    ></nz-treeselect >

    <br>
    mmm:{{ selectNodes1 | json }}
  `
})
export class DemoTreeSelectStrictBasicComponent {

  selectNodes= SELECTEDNODES;

  treeData:any = NODES;
  treeDataKeys=KEYS;

  state:any;

  @ViewChild(NzTreeSelectComponent) treeselect: NzTreeSelectComponent;


  constructor(){

  }

}
