import { Component } from '@angular/core';
import {KEYS, lazyloadNode, NODES} from './constant';
import {HttpClient} from '@angular/common/http';
import {NzTreeService} from '../components/providers/nz-tree.service';

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
                   [(ngModel)]="m"
    ></nz-treeselect>

    <br>
    数据:{{ m | json }}
  `
})
export class DemoTreeSelectSyncComponent {
  m:any;
  treeData:any = lazyloadNode;
  treeDataKeys=KEYS;
  state:any;
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
        console.log(this.nzTreeService.generateInnerNodes(res['data'],this.treeDataKeys,true));

        // 模拟返回的数据
        if(id == '2'){
          resolve([
            {
              pid:'2',
              id:'3',
              name:'设备控制-1',
              hasChildren:true

            },
            {
              pid:'2',
              id:'4',
              name:'设备控制-2',
              hasChildren:true
            },
          ])
        }else if(id == '1'){
          resolve([
            {
              pid:'1',
              id:'5',
              name:'设备控制-1',
              hasChildren:true
            }
          ])
        } else if(id == '4'){
          resolve([
            {
              pid:'4',
              id:'6',
              name:'设备控制-1',
              hasChildren:true
            }
          ])
        }else{
          resolve([])
        }

      });
    });
  }

}
