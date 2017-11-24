import {
  Component, OnChanges, SimpleChanges, Input, Output, EventEmitter, ViewChild, ViewEncapsulation, ContentChild, TemplateRef, OnInit,
  forwardRef
} from '@angular/core';
import {TreeComponent, TreeModel, TreeNode} from 'angular-tree-component';
import { NzTreeOptions } from './nz-tree.options';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'nz-tree',
  template: `
  <tree-root class="ant-tree" [class.ant-tree-show-line]="nzShowLine" [nodes]="nzNodes" [options]="_options"
             [(state)]="state"
    (toggleExpanded)="fireEvent($event)"
    (activate)="fireEvent($event)"
    (deactivate)="fireEvent($event)"
    (focus)="fireEvent($event)"
    (blur)="fireEvent($event)"
    (updateData)="fireEvent($event)"
    (initialized)="initialized($event)"
    (moveNode)="fireEvent($event)"
    (copyNode)="fireEvent($event)"
    (loadNodeChildren)="repair($event)"
    (changeFilter)="fireEvent($event)"
    (stateChange)="fireEvent($event)"> <!--状态改变-->
    <ng-template #treeNodeFullTemplate let-node let-index="index" let-templates="templates">
      <div
        [class.ant-tree-node]="true"
        [class.ant-tree-node-expanded]="node.isExpanded && node.hasChildren"
        [class.ant-tree-node-collapsed]="node.isCollapsed && node.hasChildren"
        [class.ant-tree-node-leaf]="node.isLeaf"
        [class.ant-tree-node-active]="node.isActive"
        [class.ant-tree-node-focused]="node.isFocused">
        <tree-node-drop-slot *ngIf="index === 0" [dropIndex]="node.index" [node]="node.parent"></tree-node-drop-slot>
        <span
          *ngIf="node.hasChildren"
          [class.ant-tree-switcher_open]="node.isExpanded"
          [class.ant-tree-switcher_close]="node.isCollapsed"
          class="ant-tree-switcher"
          (click)="node.mouseAction('expanderClick', $event)"></span>
        <span
          *ngIf="!node.hasChildren"
          class="ant-tree-switcher ant-tree-switcher-noop">
        </span>
        <span *ngIf="nzCheckable"
          class="ant-tree-checkbox"
          [class.ant-tree-checkbox-checked]="node.data.checked"
          [class.ant-tree-checkbox-disabled]="node.data.disableCheckbox"
          [class.ant-tree-checkbox-indeterminate]="node.data.halfChecked"
          (click)="toggleCheck(node)">
          <span class="ant-tree-checkbox-inner"></span>
        </span>
        <span class="ant-tree-node-content-wrapper"
          [class.ant-tree-node-selected]="node.isActive"
          [class.ant-tree-node-content-wrapper-open]="node.isExpanded"
          [class.ant-tree-node-content-wrapper-close]="node.isCollapsed"
          (click)="node.mouseAction('click', $event)"
          (dblclick)="node.mouseAction('dblClick', $event)"
          (contextmenu)="node.mouseAction('contextMenu', $event)"
          (treeDrop)="node.onDrop($event)"
          (treeDropDragOver)="node.mouseAction('dragOver', $event)"
          (treeDropDragLeave)="node.mouseAction('dragLeave', $event)"
          (treeDropDragEnter)="node.mouseAction('dragEnter', $event)"
          [treeAllowDrop]="node.allowDrop"
          [treeDrag]="node"
          [treeDragEnabled]="node.allowDrag()">
          <span *ngIf="!nzTitle" class="ant-tree-title" [innerHTML]="node.displayField"></span>
          <ng-container
            [ngTemplateOutlet]="nzTitle"
            [ngTemplateOutletContext]="{ node: node, index: index }">
          </ng-container>
        </span>
        <tree-node-children [node]="node" [templates]="templates"></tree-node-children>
        <tree-node-drop-slot [dropIndex]="node.index + 1" [node]="node.parent"></tree-node-drop-slot>
      </div>
    </ng-template>
    <ng-template #loadingTemplate let-node let-index="index" let-templates="templates"></ng-template>
  </tree-root>
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './nz-tree.component.css' ],
  providers    : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NzTreeComponent),
      multi      : true
    }
  ],
})
export class NzTreeComponent implements OnInit, OnChanges {
  _options: NzTreeOptions;

  //数据源key定义，匹配任何数据
  @Input() nzNodeKeys:{}={};
  @Input() lazyLoad:boolean = false;
  @Input() flag:boolean = false; // 是否是嵌套对象，默认值为false

  @Input() nzNodes: any[];
  @Input() nzCheckable = false;
  @Input() nzShowLine = false;
  @Input() nzOptions: any;
  @ContentChild('nzTitle') nzTitle: TemplateRef<any>;
  @ContentChild('nzLoading') nzLoading: TemplateRef<any>;

  @Output() nzToggleExpanded = new EventEmitter();
  @Output() nzActivate = new EventEmitter();
  @Output() nzDeactivate = new EventEmitter();
  @Output() nzFocus = new EventEmitter();
  @Output() nzBlur = new EventEmitter();
  @Output() nzUpdateData = new EventEmitter();
  @Output() nzInitialized = new EventEmitter();
  @Output() nzMoveNode = new EventEmitter();
  @Output() nzCopyNode = new EventEmitter();
  @Output() nzLoadNodeChildren = new EventEmitter();
  @Output() nzChangeFilter = new EventEmitter();
  @Output() nzEvent = new EventEmitter();
  @Output() nzStateChange = new EventEmitter();
  @Output() nzCheck = new EventEmitter();

  @ViewChild(TreeComponent) tree: TreeComponent;

  constructor(){

  }

  stateValue: string;
  @Output() stateChange = new EventEmitter();

  @Input()
  get state() {
    return this.stateValue;
  }
  set state(val) {
    this.stateValue = val;
    this.stateChange.emit(this.stateValue);
  }

  get treeModel(): TreeModel {
    return this.tree.treeModel;
  }

  toggleCheck(node: TreeNode) {
    if (node.data.disableCheckbox !== true) {
      node.data.checked = !node.data.checked;
      node.data.halfChecked = false;
      this.updateCheckState(node, node.data.checked);
      this.fireEvent({ eventName: 'check', node: node, checked: node.data.checked });
    }
  }

  private updateCheckState(node: TreeNode, checkIt: boolean) {
    const childLoop = (parentNode: TreeNode) => {
      if (!parentNode.children) return;
      for (const childNode of parentNode.children) {
        if (!childNode.data.disableCheckbox) {
          childNode.data.halfChecked = false;
          childNode.data.checked = checkIt;
        }
        childLoop(childNode);
      }
    };

    childLoop(node);

    const parentLoop = (childNode: TreeNode) => {
      if (!childNode.parent) return;
      const parentNode = childNode.parent;
      let childrenCount = parentNode.children.length;
      let checkedChildrenCount = 0;
      for (const item of parentNode.children) {
        if (item.data.disableCheckbox) {
          childrenCount -= 1;
          continue;
        }
        if (item.data.checked === true) checkedChildrenCount++;
        else if (item.data.halfChecked === true) checkedChildrenCount += 0.5;
      }
      if (checkedChildrenCount === childrenCount) {
        parentNode.data.checked = true;
        parentNode.data.halfChecked = false;
      } else if (checkedChildrenCount > 0) {
        parentNode.data.checked = false;
        parentNode.data.halfChecked = true;
      } else {
        parentNode.data.checked = false;
        parentNode.data.halfChecked = false;
      }
      parentLoop(parentNode);
    };
    parentLoop(node);
  }

  fireEvent(event: any) {
    //
    const eventName = event && event.eventName;
    if (eventName && typeof eventName === 'string') {
      const emitEventName = 'nz' + (eventName.charAt(0).toUpperCase() + eventName.slice(1));
      const emitObj = this[emitEventName];
      if (<any>this[emitEventName]) this[emitEventName].emit(event);
    }
    this.nzEvent.emit(event);
  }

  ngOnInit() {
    //如果和组件使用的默认key不一样
    if(!this.flag){
      if(this.nzNodeKeys){
        this.nzNodes = this.generateInnerNodes(this.nzNodes);
      }
      this.nzNodes = this.generateNodes(this.nzNodes);
    }
  }

  /**
   * 初始化完成后,模拟选中
   * 注意只能使用treemodel类型的，而非数据
   * @param $event
   */
  initialized($event:any){
    const m = (node)=>{
      if(node.data.checked)
        this.updateCheckState(node,node.data.checked);

      node.children&&node.children.forEach(node=>{
        m(node);
      })
    }
    $event.treeModel.roots.forEach((node)=>{
      m(node);
    })
    this.nzInitialized.emit($event);

  }

  ngOnChanges(changes: SimpleChanges): void {
    this._options = Object.assign({
      animateExpand: true
    }, this.nzOptions);
  }

  [key: string]: any;

  /**
   * 生成符合组件规定的key
   * @param nodes
   * @returns {Array}
   */
  generateInnerNodes(nodes:any){
    let tnodes=[];
    nodes.forEach((node)=>{
      tnodes.push({
        'pid':node[this.nzNodeKeys['pid']],
        'id': node[this.nzNodeKeys['id']],
        'name':node[this.nzNodeKeys['name']],
        'checked':node[this.nzNodeKeys['checked']],
        'disableCheckbox':node[this.nzNodeKeys['disableCheckbox']],
      })
    })
    return tnodes;
  }

  /**
   * 生成需要的node结构
   * @param nodes
   * @returns {any}
   */
  generateNodes(nodes:any){
    let targetNodes:any=[];

    nodes.forEach((node)=>{
      let targetNode = {};
      //没有父节点
      if(node.pid ==''){
        targetNode['pid'] = node.pid;
        targetNode['id'] = node.id;
        targetNode['name'] = node.name;

        if(this.lazyLoad){
          targetNode['hasChildren'] = true;
        }

        targetNode['checked'] = node.checked;
        targetNode['disableCheckbox'] = node.disableCheckbox;
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

          if(this.lazyLoad){
            childNode['hasChildren'] = true;
          }
          childNode['checked'] = node.checked;
          childNode['disableCheckbox'] = node.disableCheckbox;

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

  repair($event:any){
    debugger;
    if(!$event.node.data.children.length){
      $event.node.data.hasChildren = false;
    }else{
      $event.node.children.forEach(node=>{
        if(node.data.checked)
          this.updateCheckState(node,node.data.checked);

      })
    }
    this.nzLoadNodeChildren.emit($event);
  }
}
