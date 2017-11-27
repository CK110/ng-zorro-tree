import {Component, ViewEncapsulation, OnInit, ViewChild, Input, ChangeDetectorRef, forwardRef, Output, EventEmitter} from '@angular/core';
import {NzTreeComponent} from '../tree/nz-tree.component';
import {DropDownAnimation} from 'ng-zorro-antd/src/core/animation/dropdown-animations';
import {ITreeState} from 'angular-tree-component';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {noop} from 'rxjs/util/noop';
import {NzTreeService} from '../providers/nz-tree.service';

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
              [nzFlag]="true"
              [nzCheckable]="true"
              [nzShowLine]="true"
              (nzEvent)="onEvent($event)"
              [nzOptions]="nzOptions"
              [nzLazyLoad]="nzLazyLoad"
              (customStateChange)="change($event)"
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
export class NzTreeSelectComponent implements OnInit , ControlValueAccessor {

  _isOpen= false;
  _dropDownPosition = 'bottom';
  _treeData: any= [];
  _triggerWidth = 0;

  @Input() nzTreeData: any= [];
  @Input() nzTreeKeys: any= {};
  @Input() nzLazyLoad = false;
  @Input() nzOptions: any;

  selectedNodes: any= [];

  //Placeholders for the callbacks which are later provided
  //by the Control Value Accessor
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  //From ControlValueAccessor interface
  writeValue(value: any) {
      this.selectedNodes = value;
  }

  //From ControlValueAccessor interface
  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  //From ControlValueAccessor interface
  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }


  @ViewChild(NzTreeComponent) tree: NzTreeComponent;
  @ViewChild('trigger') trigger;

  constructor(public nzTreeService:NzTreeService){

  }

  stateValue: ITreeState; // 组件状态
  @Output() stateChange = new EventEmitter();

  @Input()
  get state() {
    return this.stateValue;
  }
  set state(val) {
    this.stateValue = val;
    this.stateChange.emit(this.stateValue);
  }


  ngOnInit() {
    if(this.nzTreeKeys){
      this._treeData = this.nzTreeService.generateInnerNodes(this.nzTreeData,this.nzTreeKeys,this.nzLazyLoad)
    }
    this._treeData = this.nzTreeService.generateNodes(this._treeData,this.nzLazyLoad)

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
    if (event.eventName == 'check'){
      this.refreshSelectedNodes();

      console.log(this.tree);
      this._treeData = this.tree.treeModel.nodes;
    }
  }

  refreshSelectedNodes(){
    this.selectedNodes = [];
    const m = (node) => {
      // 有子节点
      if (node.children && node.children.length > 0){
        if (node.halfChecked){
          node.children.forEach(node => {
            m(node);
          });
        }else if (node.checked){
          this.selectedNodes.push(node);
        }
      }else{
        if (node.checked == true){
          // 没有子节点，但是选中
          this.selectedNodes.push(node);
        }
      }
    };
    this.tree.treeModel.nodes.forEach((node) => {
      m(node);
    });

    this.onChangeCallback(this.selectedNodes);
  }

  _openTreeView(){
    //
    this._isOpen = true;
    // setTimeout(()=>{
    //   if(this.tree)
    //      this.tree._state = this._state;
    // },50)
  }

  closeDropDown() {
    this._isOpen = false;
  }

  onPositionChange(position) {
    this._dropDownPosition = position.connectionPair.originY;
  }

  _setTriggerWidth(): void {
    this._triggerWidth = this.trigger.nativeElement.getBoundingClientRect().width;
  }

  change(event){
    this.stateValue = event;
  }

}
