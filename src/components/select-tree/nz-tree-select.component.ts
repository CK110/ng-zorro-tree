import {Component, ViewEncapsulation, OnInit, ViewChild, Input, ChangeDetectorRef, forwardRef, Output, EventEmitter} from '@angular/core';
import {NzTreeComponent} from '../tree/nz-tree.component';
import {DropDownAnimation} from 'ng-zorro-antd/src/core/animation/dropdown-animations';
import {ITreeState} from 'angular-tree-component';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'nz-treeselect',
  template: `    
    <div class="ant-select ant-select-enabled ant-select-show-search" style="width: 400px;">
        <div tabindex="0" (click)="_openTreeView()" #trigger cdkOverlayOrigin #origin="cdkOverlayOrigin" 
             class="ant-select-selection ant-select-selection--multiple">
          <div class="ant-select-selection__rendered" >
            <ul>
              <li *ngFor="let s of selectedNodes" class="ant-select-selection__choice ng-trigger ng-trigger-tagAnimation" style="user-select: none; opacity: 1; transform: scale(1);" >
                <div class="ant-select-selection__choice__content">
                  {{s.name}}
                </div>
                <span class="ant-select-selection__choice__remove"></span>
                <!--<span (click)="deleteSelected(s)">x</span>-->
              </li>
            </ul>
          </div>
        </div>
        <span
          (click)="onTouched();clearSelect($event)"
          class="ant-select-selection__clear"
          style="-webkit-user-select: none;"
          *ngIf="_selectedOption?.nzLabel&&nzAllowClear&&!nzMultiple">
        </span>
        <span class="ant-select-arrow" ><b></b></span>
    </div>
    
    <ng-template
      cdkConnectedOverlay
      cdkConnectedOverlayHasBackdrop
      [cdkConnectedOverlayOrigin]="origin"
      (backdropClick)="closeDropDown()"
      (detach)="closeDropDown();"
      (positionChange)="onPositionChange($event)"
      [cdkConnectedOverlayWidth]="_triggerWidth"
      [cdkConnectedOverlayOpen]="_isOpen"
    >
      <div class="ant-select-dropdown ant-select-dropdown--multiple ant-select-dropdown-placement-bottomLeft ng-trigger ng-trigger-dropDownAnimation" 
           [@dropDownAnimation]="_dropDownPosition" >
        <div style="overflow: auto;">
          <div class="ant-select-dropdown-menu ant-select-dropdown-menu-vertical ant-select-dropdown-menu-root">
            <nz-tree  
              [(state)]="stateValue" 
              [nzNodes]="_treeData" 
              [flag]="true" 
              [nzCheckable]="true" 
              [nzShowLine]="true" 
              (nzEvent)="onEvent($event)"
              [nzOptions]="nzOptions"
            ></nz-tree>
          </div>
        </div>
      </div>
    </ng-template>
    
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ './nz-tree-select.component.css' ],
  animations   : [
    DropDownAnimation,
  ],
  providers    : [
    {
      provide    : NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NzTreeSelectComponent),
      multi      : true
    }
  ],

})
export class NzTreeSelectComponent implements OnInit {
  _isOpen= false;
  _dropDownPosition = 'bottom';
  _treeData:any=[];
  _triggerWidth = 0;

  @Input() nzTreeData:any=[];
  @Input() nzTreeKeys:any={};
  @Input() nzLazyLoad:boolean = false;
  @Input() nzOptions:any;

  selectedNodes:any=[];

  @ViewChild(NzTreeComponent) tree: NzTreeComponent;
  @ViewChild('trigger') trigger;

  constructor(){

  }


  stateValue: ITreeState;//组件状态
  @Output() stateChange = new EventEmitter();

  @Input()
  get state() {
    return this.stateValue;
  }
  set state(val) {
    this.stateValue = val;
    this.stateChange.emit(this.stateValue);
  }

  // stateChange(state){
  //   this._state = state;
  //   console.log(state);
  // }

  ngOnInit() {
    if(this.nzTreeKeys){
      this._treeData = this.generateInnerNodes(this.nzTreeData,this.nzTreeKeys);
    }
    this._treeData = this.generateNodes(this._treeData);

    this._setTriggerWidth();
  }

  /**
   * TODO
   * @param i
   */
  deleteSelected(i){
    // console.log(i.id);
    // this.nzTreeData=[];
    // this.refreshSelectedNodes();
  }

  onEvent(event) {
    if(event.eventName=="check"){
      this.refreshSelectedNodes();

      console.log(this.tree);
      this._treeData = this.tree.treeModel.nodes;
    }
  }

  refreshSelectedNodes(){
    this.selectedNodes = [];
    const m = (node)=>{
      //有子节点
      if(node.children&&node.children.length>0){
        if(node.halfChecked){
          node.children.forEach(node=>{
            m(node);
          })
        }else if(node.checked){
          this.selectedNodes.push(node);
        }
      }else{
        if(node.checked ==true){
          //没有子节点，但是选中
          this.selectedNodes.push(node);
        }
      }
    }
    this.tree.treeModel.nodes.forEach((node)=>{
      m(node);
    })
  }

  _openTreeView(){
    //
    this._isOpen =true;
    // setTimeout(()=>{
    //   if(this.tree)
    //      this.tree._state = this._state;
    // },50)
  }

  closeDropDown(){
    this._isOpen =false;
  }

  onPositionChange(position) {
    this._dropDownPosition = position.connectionPair.originY;
  }

  _setTriggerWidth(): void {
    this._triggerWidth = this.trigger.nativeElement.getBoundingClientRect().width;
  }

  /**
   * 生成符合组件规定的key
   * @param nodes
   * @returns {Array}
   */
  generateInnerNodes(nodes:any,nzNodeKeys:any){
    let tnodes=[];
    nodes.forEach((node)=>{
      tnodes.push({
        'pid':node[nzNodeKeys['pid']],
        'id': node[nzNodeKeys['id']],
        'name':node[nzNodeKeys['name']],
        'checked':node[nzNodeKeys['checked']],
        'disableCheckbox':node[nzNodeKeys['disableCheckbox']],
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

        if(this.nzLazyLoad){
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

          if(this.nzLazyLoad){
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

}
