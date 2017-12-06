import {Component, OnChanges, SimpleChanges, Input, Output, EventEmitter, ViewChild, ViewEncapsulation, ContentChild, TemplateRef, OnInit, forwardRef} from '@angular/core';
import {IActionMapping, ITreeState, TREE_ACTIONS, TreeComponent, TreeModel, TreeNode} from 'angular-tree-component';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {ITreeOptions} from 'angular-tree-component';

export interface NzTreeOptions extends ITreeOptions {

}

export interface NzNodeKeys{
  pid:string;
  id:string;
  name:string;
  disableCheckbox?:string;
}

@Component({
  selector: 'nz-tree',
  template: `
    <tree-root class="ant-tree" [class.ant-tree-show-line]="nzShowLine" [nodes]="_nzNodes" [options]="_options"
               (toggleExpanded)="fireEvent($event)"
               (activate)="fireEvent($event)"
               (deactivate)="fireEvent($event)"
               (focus)="fireEvent($event)"
               (blur)="fireEvent($event)"
               (updateData)="fireEvent($event)"
               (initialized)="fireEvent($event)"
               (moveNode)="fireEvent($event)"
               (copyNode)="fireEvent($event)"
               (loadNodeChildren)="fireEvent($event)"
               (changeFilter)="fireEvent($event)"
               (stateChange)="fireEvent($event)">
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
  encapsulation: ViewEncapsulation.Native,
  styleUrls: ['./nz-tree.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NzTreeComponent),
      multi: true
    }
  ],
})
export class NzTreeComponent implements OnInit, OnChanges {
  _options: NzTreeOptions;
  _nzNodes:any[];

  @Input() nzCheckStrictly:boolean =false;
  @Input() nzLazyLoad:boolean = false;
  @Input() nzNodeKeys: NzNodeKeys;

  @Input() nzNodes: any[];
  @Input() nzCheckable = false;
  @Input() nzShowLine = false;
  @Input() nzOptions: any;
  @Input() nzShiftSelectedMulti = true;
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

  @ViewChild(TreeComponent)
  tree: TreeComponent;

  get treeModel(): TreeModel {
    return this.tree.treeModel;
  }

  // 双向绑定
  value:any;

  writeValue(value: any) {
    this.value = value;
    console.log(this.value);
    if(this.value && this.nzCheckable){
      this._nzNodes = this.generateNodes(this.nzNodes);
    }
  }

  updateModel(value) {
    this.value = value;

    this.onModelChange(this.value);
  }

  onModelChange: Function = () => {};
  onModelTouched: Function = () => {};

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  toggleCheck(node: TreeNode) {
    if (node.data.disableCheckbox !== true) {
      node.data.checked = !node.data.checked;
      node.data.halfChecked = false;

      if(!this.nzCheckStrictly){
        this.updateCheckState(node, node.data.checked);
      }
      this.refreshSelectedNodes();

      this.fireEvent({eventName: 'check', node: node, checked: node.data.checked});
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
    const eventName = event && event.eventName;


    /** 模拟选中 */
    if(eventName ==='initialized' && !this.nzCheckStrictly){
      const m = (node)=>{
        if(node.data.checked)
          this.updateCheckState(node,node.data.checked);
        node.children&&node.children.forEach(node=>{
          m(node);
        })
      }
      event.treeModel.roots.forEach((node)=>{
        m(node);
      })
    }

    /**异步加载后修改状态*/
    if(eventName ==='loadNodeChildren' ){
      if(!event.node.data.children.length){
        event.node.data.hasChildren = false;
      }else{
        event.node.children.forEach(node=>{
          if(node.data.checked)
            this.updateCheckState(node,node.data.checked);
        })
      }
    }

    if(eventName === 'stateChange'){
      console.log(event);
    }

    if (eventName && typeof eventName === 'string') {
      const emitEventName = 'nz' + (eventName.charAt(0).toUpperCase() + eventName.slice(1));
      const emitObj = this[emitEventName];
      if (<any>this[emitEventName]) this[emitEventName].emit(event);
    }
    this.nzEvent.emit(event);
  }

  ngOnInit() {
    console.log('this._options', this._options);

    this.nzNodes = this.generateNodesByKeys(this.nzNodes);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const actionMapping: IActionMapping = {};
    if (this.nzShiftSelectedMulti) {
      actionMapping.mouse = {
        click: (tree, node, $event: any) => {
          $event.shiftKey
            ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event)
            : TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event);
        }
      };
    }
    this._options = Object.assign({
      actionMapping,
      animateExpand: true
    }, this.nzOptions);
  }

  /**
   * 生成符合组件规定的key
   * @param nodes
   * @returns {Array}
   */
  private generateNodesByKeys(nodes: any[]){
    const tnodes = [];
    nodes.forEach((node) => {
      tnodes.push({
        'pid': node[this.nzNodeKeys['pid']],
        'id': node[this.nzNodeKeys['id']],
        'name': node[this.nzNodeKeys['name']],
        'disableCheckbox': node[this.nzNodeKeys['disableCheckbox']] || false,
      });
    });
    return tnodes;
  }

  /**
   * 生成需要的node结构
   * @param nodes
   * @returns {any}
   */
  private generateNodes(nodes: any[]){
    const rootNodes: any = [];
    const childrenNodes:any =[];

    nodes.forEach((node) => {
      const rootNode = {};
      //根节点
      if (node.pid == ''){
        rootNode['pid'] = node.pid;
        rootNode['id'] = node.id;
        rootNode['name'] = node.name;
        if (this.nzLazyLoad){
          rootNode['hasChildren'] = true;
        }

        if(this.value && this.value.indexOf(node.id)!=-1){
          rootNode['checked'] = true;
        }else{
          rootNode['checked'] = false;
        }

        rootNode['disableCheckbox'] = node.disableCheckbox;
        rootNodes.push(rootNode);
      }else{
        childrenNodes.push(node);
      }
    });

    console.log(rootNodes);
    console.log(this.generateChildren(rootNodes,childrenNodes));

    return this.generateChildren(rootNodes,childrenNodes);

  }

  private generateChildren(targetNodes:any[], nodes:any[]){
    targetNodes.forEach((tnode, index) => {
      const tid = tnode.id;      //父id
      const childrenNodes: any = [];
      nodes.forEach((node, i) => {
        const childNode = {};
        if (node.pid == tid){
          childNode['pid'] = node.pid;
          childNode['id'] = node.id;
          childNode['name'] = node.name;

          if (this.nzLazyLoad){
            childNode['hasChildren'] = true;
          }

          if(this.value && this.value.indexOf(node.id)!=-1){
            childNode['checked'] = true;
          }else{
            childNode['checked'] = false;
          }

          childNode['disableCheckbox'] = node.disableCheckbox;
          childrenNodes.push(childNode);
        }
      });

      if (childrenNodes.length > 0){
        targetNodes[index].children = childrenNodes;
        this.generateChildren(targetNodes[index].children, nodes);
      }
    });

    return targetNodes;
  }

  private refreshSelectedNodes(){
    const selectedNodes = [];
    const _selectedNodes = [];

    const m = (node) => {
      // 有子节点
      if (node.children && node.children.length > 0){
        if (node.halfChecked){
          node.children.forEach(node => {
            m(node);
          });
        }else if (node.checked){
          selectedNodes.push(node.id);
          _selectedNodes.push(node);

        }
      }else{
        if (node.checked == true){
          // 没有子节点，但是选中
          selectedNodes.push(node.id);
          _selectedNodes.push(node);

        }
      }
    };

    const n = (node) => {
      if (node.children && node.children.length > 0){
        if (node.checked){
          selectedNodes.push(node.id);
          _selectedNodes.push(node);

        }
        node.children.forEach(node => {
          n(node);
        });
      }else{
        if (node.checked == true){
          selectedNodes.push(node.id);
          _selectedNodes.push(node);

        }
      }
    };

    this.tree.treeModel.nodes.forEach((node) => {
      if(!this.nzCheckStrictly){
        m(node);
      }else{
        n(node);
      }
    });

    this.updateModel(selectedNodes);
  }

}
