import {Injectable} from '@angular/core';

@Injectable()
export class NzTreeService {
  nzNodeKeys = {
    'pid': 'pid',
    'id': 'id',
    'name': 'name',
    'checked': 'checked',
    'disableCheckbox': 'disableCheckbox',
  }

  constructor(){

  }
  /**
   * 生成符合组件规定的key
   * @param nodes
   * @returns {Array}
   */
  generateInnerNodes(nodes: any[], nzNodeKeys: any,nzLazyLoad:boolean){
    if(!nzNodeKeys){
      nzNodeKeys= this.nzNodeKeys;
    }
    const tnodes = [];
    nodes.forEach((node) => {
      if(nzLazyLoad){
        tnodes.push({
          'pid': node[nzNodeKeys['pid']],
          'id': node[nzNodeKeys['id']],
          'name': node[nzNodeKeys['name']],
          'checked': node[nzNodeKeys['checked']],
          'disableCheckbox': node[nzNodeKeys['disableCheckbox']],
        });
      }else{
        tnodes.push({
          'pid': node[nzNodeKeys['pid']],
          'id': node[nzNodeKeys['id']],
          'name': node[nzNodeKeys['name']],
          'checked': node[nzNodeKeys['checked']],
          'disableCheckbox': node[nzNodeKeys['disableCheckbox']],
          'hasChildren':true
        });
      }
    });
    return tnodes;
  }


  /**
   * 生成需要的node结构
   * @param nodes
   * @returns {any}
   */
  generateNodes(nodes: any[],nzLazyLoad:boolean){
    const targetNodes: any = [];

    nodes.forEach((node) => {
      const targetNode = {};
      //没有父节点
      if (node.pid == ''){
        targetNode['pid'] = node.pid;
        targetNode['id'] = node.id;
        targetNode['name'] = node.name;

        if (nzLazyLoad){
          targetNode['hasChildren'] = true;
        }

        targetNode['checked'] = node.checked;
        targetNode['disableCheckbox'] = node.disableCheckbox;
        targetNodes.push(targetNode);
      }
    });

    return this.generateChildren(targetNodes, nodes,nzLazyLoad);
  }

  private generateChildren(targetNodes:any[], nodes:any[],nzLazyLoad:boolean){
    targetNodes.forEach((tnode, index) => {
      const tid = tnode.id;      //父id
      const childrenNodes: any = [];
      nodes.forEach((node, i) => {
        const childNode = {};
        if (node.pid == tid){
          childNode['pid'] = node.pid;
          childNode['id'] = node.id;
          childNode['name'] = node.name;

          if (nzLazyLoad){
            childNode['hasChildren'] = true;
          }
          childNode['checked'] = node.checked;
          childNode['disableCheckbox'] = node.disableCheckbox;

          childrenNodes.push(childNode);
        }
      });

      if (childrenNodes.length > 0){
        targetNodes[index].children = childrenNodes;
        this.generateChildren(targetNodes[index].children, nodes,nzLazyLoad);
      }
    });
    return targetNodes;
  }
}
