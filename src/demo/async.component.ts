import { Component } from '@angular/core';
import {lazyloadNode} from './constant';

@Component({
  selector: 'demo-async',
  template: `
  <h2>懒加载节点</h2>
  <nz-tree [nzNodes]="nodes"
           [nzShowLine]="true"
           [nzCheckable]="true"
           [nzOptions]="options"
           [nzNodeKeys]="nodeKeys"
           [nzLazyLoad]="true"
           (nzLoadNodeChildren)="onEvent1($event)"
           (nzEvent)="onEvent($event)"></nz-tree>
  `
})
export class DemoAsyncComponent {
  nodeKeys={
    'pid':'zpid',
    'id':'zid',
    'name':'zname',
    'checked':'zchecked',
    'disableCheckbox':'zdisableCheckbox',
  };


  nodes = lazyloadNode;

  options = {
    getChildren: (node: any) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          debugger;
          if(node.data.id=='2'){
            resolve([
              {
                // id:'5',
                // pid:'1',
                name: 'async data1',
                checked: true,
                disableCheckbox:true
              },
              {
                // id:'6',
                // pid:'1',
                name: 'async data2',
                checked: true,

              }
            ])
          }else{
            resolve([])
          }

        } , 1000);
      });
    }
  };

  onEvent(ev: any) {
    // console.log('async', 'onEvent', ev);
  }

  onEvent1(ev: any) {
    console.log('22',ev);
  }
}
