import {Component, ViewChild} from '@angular/core';
import {NODES} from './constant';
import {NzTreeComponent} from "../components/tree/nz-tree.component";

@Component({
  selector: 'demo-basic-strict',
  template: `    
      <h2>CheckStrictly</h2><br>
      <h3>选中的数据(id 数组): {{selectNodes1 | json}}</h3><br>
      <a (click)="mod()">修改初始双向绑定对象值</a> |
      <a (click)="click1()">展开</a> |
      <a (click)="click2()">收拢</a> |
      <a (click)="click3()">全选</a> |
      <a (click)="click4()">不选</a> |
      <a (click)="click5()">获取数据对象格式的，点击后请看控制台</a>

      <nz-tree [nzNodes]="nodes"
               [nzCheckable]="true"
               [nzNodeKeys]="nodeKeys"
               [nzShowLine]="false"
               [(ngModel)]="selectNodes1"
               [nzCheckStrictly]="true"
               (nzEvent)="onEvent($event)"></nz-tree>
  `
})
export class DemoBasicStrictComponent {

  nodeKeys={
    'pid':'zpid',
    'id':'zid',
    'name':'zname',
  };

  nodes= NODES;

  selectNodes1= ['1'];

  @ViewChild(NzTreeComponent) tree: NzTreeComponent;

  click1(){
    this.tree.expandAll();
  }

  click2(){
    this.tree.collapseAll();
  }

  click3(){
    this.tree.selectAll();
  }

  click4(){
    this.tree.unselectAll();
  }

  click5(){
    console.log('选中数据',this.tree.getSelectedNodes())
  }

  onEvent(ev: any) {
    console.log('basic', 'onEvent', ev);
  }

  mod(){
    this.selectNodes1=['1','2']
  }

}
