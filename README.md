# NgZorroTree

在 `ng-tree-antd`的基础上，根据业务需要修改而成。

面向后端平级数据，由组件自身身材需要的嵌套结构:

后端返回数据格式:

```
[
  {
    zpid:'',          // 父节点id
    zid:'1',          // 节点自身id
    zname:'状态监控',  // 节点名称
  },
  {
    zpid:'',
    zid:'2',
    zname:'设备控制',
  },
  {
    zpid:'',
    zid:'11',
    zname:'设备控制2',
  },
  {
    zpid:'11',
    zid:'12',
    zname:'设备控制2-2',
  },
  {
    zpid:'11',
    zid:'13',
    zname:'设备控制2-2',
  },
  {
    zpid:'13',
    zid:'14',
    zname:'设备控制2-2',
  }
]
```


组件内部的格式:

```
[
  {
    pid:'',
    id:'1',
    name:'状态监控',
  },
  {
    pid:'',
    id:'2',
    name:'设备控制',
  },
  {
    pid:'',
    id:'11',
    name:'设备控制2',
    children:[
      {
        pid:'11',
        id:'12',
        name:'设备控制2-2',
      },
      {
        pid:'11',
        id:'13',
        name:'设备控制2-2',
        children:[        
          {
            pid:'13',
            id:'14',
            name:'设备控制2-2',
          }        
        ]
      },
    ]
  },
]
```

## Dependencies

+ `angular-tree-component` **^5.2.0**




## tree

### API

| Name    | Type           | Default  | Summary |
| ------- | ------------- | ----- | ----- |
| nzNodes | `any[]` |  |   {zpid:'',zid:'2',zname:'设备控制','checked':true}, |
| nzNodeKeys | `Object` |  | 外部数据与内部数据key的转换，实现面向后端 , <br> 示例: nodeKeys={'pid':'zpid','id':'zid','name':'zname','checked':'zchecked','disableCheckbox':'zdisableCheckbox',
| nzCheckable | `boolean` | `false` | 在节点之前添加一个复选框 |
| nzShowLine | `boolean` | `false` | 显示了一个连接线 |
| nzOptions | `TreeOptions` |  | see [options](https://angular2-tree.readme.io/docs/options)，最常用为loadChildren来实现懒加载 |
| nzEvent | `EventEmitter` |  | node 上的各种事件的集合 |


## treeselect 

### API
| Name    | Type           | Default  | Summary |
| ------- | ------------- | ----- | ----- |
| nzTreeData | `any[]` |  |  示例: {zpid:'',zid:'2',zname:'设备控制'} |
| nzTreeKeys | `Object` |  | 外部数据与内部数据key的转换，实现面向后端 , <br> 示例: nodeKeys={'pid':'zpid','id':'zid','name':'zname','checked':'zchecked','disableCheckbox':'zdisableCheckbox',
| nzLazyLoad | `boolean` | `false` | 加载方式，设置为true时为懒加载 |
| nzOptions | `boolean` | `false` | see [options](https://angular2-tree.readme.io/docs/options)，最常用为loadChildren来实现懒加载 |


## 懒加载

```
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
        console.log(this.nzTreeService.generateInnerNodes(res['data'],this.nodeKeys));

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

```
