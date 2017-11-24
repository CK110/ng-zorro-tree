import { Component } from '@angular/core';
import {KEYS, lazyloadNode, NODES} from './constant';

@Component({
  selector: 'demo-treeselect-sync',
  template: `

    <h2>懒加载节点</h2>

    <nz-treeselect 
                   [nzTreeData]="treeData"
                   [nzTreeKeys]="treeDataKeys"
                   [nzLazyLoad]=true
                   [nzOptions]="options"
                   [(state)]="state"
    ></nz-treeselect>
  `
})
export class DemoTreeSelectSyncComponent {

  treeData:any = lazyloadNode;
  treeDataKeys=KEYS;

  state:any;


  constructor(){

  }

  ngOnInit() {

  }

  options = {
    getChildren: (node: any) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if(node.data.id=='2'){
            resolve([
              {
                name: 'async data1',
                disableCheckbox:true,

              },
              {
                name: 'async data2',

              }
            ])
          }else{
            resolve([])
          }

        } , 1000);
      });
    }
  };

}
