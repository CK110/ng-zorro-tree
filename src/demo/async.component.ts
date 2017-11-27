import { Component } from '@angular/core';
import {KEYS, lazyloadNode} from './constant';
import {NzTreeService} from '../components/providers/nz-tree.service';
import {HttpClient} from '@angular/common/http';

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
           (nzEvent)="onEvent($event)"></nz-tree>
  `
})
export class DemoAsyncComponent {
  nodeKeys=KEYS;

  nodes = lazyloadNode;

  options = {
    getChildren: (node: any) => {
      return this.getData(node.id);
    }
  };

  constructor(public nzTreeService:NzTreeService,public http: HttpClient){

  }

  getData(id:string){
    return new Promise((resolve, reject) => {
      this.http.get('https://easy-mock.com/mock/5a1bcb8b9144e669fc6e94d6/getlazydata').subscribe(res => {
        // resolve( this.nzTreeService.generateInnerNodes(res['data'],this.nodeKeys))
        console.log(this.nzTreeService.generateInnerNodes(res['data'],this.nodeKeys,true));

        // 模拟返回的数据
        if(id == '2'){
          resolve([
            {
              pid:'2',
              id:'3',
              name:'设备控制-1',
              checked:true,
              'hasChildren':true

            },
            {
              pid:'2',
              id:'4',
              name:'设备控制-2',
              'hasChildren':true
            },
          ])
        }else if(id == '1'){
          resolve([
            {
              pid:'1',
              id:'5',
              name:'设备控制-1',
              'hasChildren':true
            }
          ])
        } else if(id == '4'){
          resolve([
            {
              pid:'4',
              id:'6',
              name:'设备控制-1',
              'hasChildren':true
            }
          ])
        }else{
          resolve([])
        }
      });
    });
  }

  onEvent(ev: any) {

  }
}
