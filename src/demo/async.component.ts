import { Component } from '@angular/core';
import {KEYS, lazyloadNode, SELECTEDNODES} from './constant';

@Component({
  selector: 'demo-async',
  template: `
    <h2>懒加载节点(严格模式)</h2>
    <h3>选中的数据(id 数组): {{selectNodes1 | json}}</h3><br>
    <nz-tree [nzNodes]="nodes"
             [nzShowLine]="true"
             [nzCheckable]="true"
             [nzOptions]="options"
             [nzNodeKeys]="nodeKeys"
             [nzLazyLoad]="true"
             [(ngModel)]="selectNodes1"
             [nzCheckStrictly]="false" ></nz-tree>

  `
})
export class DemoAsyncComponent {

  nodeKeys=KEYS;

  nodes = lazyloadNode;

  selectNodes1= SELECTEDNODES;

  options = {
    getChildren: (node: any) => {
      return this.getData(node.id);
    }
  };

  constructor(){

  }

  getData(id:string){
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        if(id == '2'){
          resolve([
            {
              pid:'2',
              id:'21',
              name:'2-21',
              hasChildren:true
            },
          ])
        }else if(id == '1'){
          resolve([
            {
              pid:'1',
              id:'11',
              name:'1-11',
              hasChildren:true

            },
            {
              pid:'1',
              id:'12',
              name:'1-12',
              hasChildren:true

            },
          ])
        } else if(id == '3'){
          resolve([
            {
              pid:'3',
              id:'31',
              name:'3-32',
              hasChildren:true

            },
          ])
        }else if(id == '31'){
          resolve([
            {
              pid:'31',
              id:'311',
              name:'3-32-311',
              hasChildren:true

            },
            {
              pid:'31',
              id:'312',
              name:'3-32-312',
              hasChildren:true

            },
          ])
        }else if(id == '311'){
          resolve([
            {
              pid:'311',
              id:'3111',
              name:'3-32-311-3111',
              hasChildren:true

            },
          ])
        }else{
          resolve([])
        }
      },1000)

    })
  }

}
