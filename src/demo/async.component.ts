import {Component, ViewChild} from '@angular/core';
import {KEYS, lazyloadNode, SELECTEDNODES} from './constant';
import {NzTreeComponent} from '../components/tree/nz-tree.component';

@Component({
  selector: 'demo-async',
  template: `
    <h2>懒加载节点(严格模式)</h2>
    
    <h3>选中的数据(id 数组): {{selectNodes1 | json}}</h3><br>
    <nz-tree [nzNodes]="nodes"
             [nzShowLine]="false"
             [nzCheckable]="true"
             [nzOptions]="options"
             [nzNodeKeys]="nodeKeys"
             [nzLazyLoad]="true"
             [(ngModel)]="selectNodes1"
             [nzCheckStrictly]="true"
             (nzEvent)="onEvent($event)"></nz-tree>

  `
})
export class DemoAsyncComponent {

  nodeKeys=KEYS;

  nodes = lazyloadNode;

  selectNodes1= SELECTEDNODES;

  @ViewChild(NzTreeComponent) tree: NzTreeComponent;


  options = {
    getChildren: (node: any) => {
      return this.getData(node.id);
    }
  };

  constructor(){

  }



  getData(id:string){

    const m = this.tree.generateNodesByKeys(this.getResult(id));

    console.log("generateNodesByKeys",m);

    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        resolve(m)
      },1000)
    })
  }

  onEvent(ev: any) {
    console.log('basic', 'onEvent', ev);
  }


  getResult(id:string){
    if(id == '2'){
      return [
        {
          zpid:'2',
          zid:'21',
          zname:'2-21',
        },
      ]
    }else if(id == '1'){
      return [
        {
          zpid:'1',
          zid:'11',
          zname:'1-11',

        },
        {
          zpid:'1',
          zid:'12',
          zname:'1-12',

        },
      ]
    } else if(id == '3'){
      return [
        {
          zpid:'3',
          zid:'31',
          zname:'3-32',

        },
      ]
    }else if(id == '31'){
      return [
        {
          zpid:'31',
          zid:'311',
          zname:'3-32-311',
        },
        {
          zpid:'31',
          zid:'312',
          zname:'3-32-312',
        },
      ]
    }else if(id == '311'){
      return[
        {
          zpid:'311',
          zid:'3111',
          zname:'3-32-311-3111',
        },
      ]
    }else{
      return []
    }
  }

}
