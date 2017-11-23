import { Component } from '@angular/core';
import {NODES} from './constant';

@Component({
  selector: 'demo-one',
  template: `
    <h2>支持复选的树状结构</h2>
    <nz-tree [nzNodes]="nodes"
             [nzCheckable]="true"
             [nzShowLine]="true"
             (nzEvent)="onEvent($event)"></nz-tree>
  `
})
export class DemoOneComponent {
  nodes:any = NODES;

  ngOnInit() {
    this.nodes = this.generateData(this.nodes);
  }

  onEvent(ev: any) {
    console.log('basic', 'onEvent', ev);
  }

  generateData(nodes:any){
    let targetNodes:any=[];

    nodes.forEach((node)=>{
      let targetNode = {};
      //没有父节点
      if(node.pid ==''){
        targetNode['pid'] = node.pid;
        targetNode['id'] = node.id;
        targetNode['name'] = node.name;
        // targetNode['hasChildren'] = node.hasChildren;

        // targetNode['checked'] = node.checked;
        // targetNode['disableCheckbox'] = node.disableCheckbox;
        // targetNode['halfChecked'] = node.halfChecked;
        // targetNode['children'] = node.children;
        // targetNode['hasChildren'] = node.hasChildren;
        targetNodes.push(targetNode);
      }
    });

    return this.generateChildren(targetNodes,nodes);
  }


  generateChildren(targetNodes,nodes){
    targetNodes.forEach((tnode,index)=>{
      const tid = tnode.id;      //父id

      let childrenNodes:any=[];
      nodes.forEach((node,i)=>{
        let childNode = {};
        if(node.pid == tid){
          childNode['pid'] = node.pid;
          childNode['id'] = node.id;
          childNode['name'] = node.name;

          childrenNodes.push(childNode);
        }
      })

      if(childrenNodes.length >0){
        targetNodes[index].children = childrenNodes;
        this.generateChildren(targetNodes[index].children,nodes);
      }
    })
    return targetNodes;
  }

}
