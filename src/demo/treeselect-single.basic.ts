import {Component, ViewChild} from '@angular/core';
import {KEYS, NODES} from './constant';
import {NzTreeSelectComponent} from '../components/tree-select/nz-tree-select.component';

@Component({
  selector: 'demo-treeselect-single-basic',
  template: `
    <h2>单选</h2>

    <nz-treeselect 
                   [nzTreeData]="treeData" 
                   [nzTreeKeys]="treeDataKeys" 
                   [nzOptions]="options" 
                   [nzLazyLoad]=false
                   [nzCheckable]="false"
                   [(ngModel)]="selectNodes1"
    ></nz-treeselect >
    
    <br>
    mmm:{{ selectNodes1 | json }}
  `
})
export class DemoTreeSingleSelectBasicComponent {

  selectNodes1= '21';

  treeData:any = NODES;
  treeDataKeys=KEYS;

  state:any;

  @ViewChild(NzTreeSelectComponent) treeselect: NzTreeSelectComponent;


  constructor(){

  }

}
