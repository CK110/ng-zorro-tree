import {Component, ViewChild} from '@angular/core';
import {KEYS, NODES, SELECTEDNODES} from './constant';
import {NzTreeSelectComponent} from '../components/tree-select/nz-tree-select.component';

@Component({
  selector: 'demo-treeselect-basic',
  template: `    
    <h2>多选</h2>

    <nz-treeselect
      [nzTreeData]="treeData"
      [nzTreeKeys]="treeDataKeys"
      [nzOptions]="options"
      [nzLazyLoad]=false
      [nzCheckable]="true"
      [(ngModel)]="selectNodes"
      [nzTreeCheckStrictly]="false"
    ></nz-treeselect >

    <br>
    mmm:{{ selectNodes | json }}
  `
})
export class DemoTreeSelectBasicComponent {

  selectNodes= SELECTEDNODES;

  treeData:any = NODES;
  treeDataKeys=KEYS;

  state:any;

  @ViewChild(NzTreeSelectComponent) treeselect: NzTreeSelectComponent;


  constructor(){

  }

}
