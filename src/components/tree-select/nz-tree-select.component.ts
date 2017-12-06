import {Component, ViewEncapsulation, OnInit, ViewChild, Input, forwardRef, Output, EventEmitter} from '@angular/core';
import {NzTreeComponent} from '../tree/nz-tree.component';
import {DropDownAnimation} from 'ng-zorro-antd/src/core/animation/dropdown-animations';
import {ITreeState} from 'angular-tree-component';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {noop} from 'rxjs/util/noop';

@Component({
  selector: 'nz-treeselect',
  template: `
    <div class="ant-select ant-select-enabled ant-select-show-search" style="width: 100%;">
        <div tabindex="0" (click)="_openTreeView()" 
             #trigger cdkOverlayOrigin 
             #origin="cdkOverlayOrigin"
             class="ant-select-selection ant-select-selection--multiple"  >
          <div class="ant-select-selection__rendered" >
            <ul>
              <li *ngFor="let s of selectedNodes" class="ant-select-selection__choice ng-trigger ng-trigger-tagAnimation" [ngClass]="{'ant-select-selection--single': !nzCheckable}" style="user-select: none; opacity: 1; transform: scale(1);" >
                <div class="ant-select-selection__choice__content">
                  {{getNodeName(s)}}
                </div>
                <span class="ant-select-selection__choice__remove"></span>
                <!--<span (click)="deleteSelected(s)">x</span>-->
              </li>
            </ul>
          </div>
        </div>
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
          <div *ngIf="nzCheckable" class="ant-select-dropdown-menu ant-select-dropdown-menu-vertical ant-select-dropdown-menu-root">
            <nz-tree
              [(ngModel)]="selectedNodes"
              [nzNodes]="nzTreeData"
              [nzNodeKeys]="nzTreeKeys"
              [(state)]="_stateValue"
              [nzCheckable]="nzCheckable"
              [nzShowLine]="nzShowLine"
              [nzOptions]="nzOptions"
              (customStateChange)="change($event)"
              (ngModelChange)="select($event)"
              [nzCheckStrictly]="nzTreeCheckStrictly"
            ></nz-tree>
          </div>

          <div *ngIf="!nzCheckable" class="ant-select-dropdown-menu ant-select-dropdown-menu-vertical ant-select-dropdown-menu-root">
            <nz-tree
              [(ngModel)]="selectedNodes"
              [nzNodes]="nzTreeData"
              [nzNodeKeys]="nzTreeKeys"
              [(state)]="_stateValue"
              [nzCheckable]="nzCheckable"
              [nzShowLine]="nzShowLine"
              [nzOptions]="nzOptions"
              (customStateChange)="change($event)"
              (ngModelChange)="select($event)"
              (nzEvent)="event($event)"
            ></nz-tree>
          </div>
        </div>
      </div>
    </ng-template>

  `,
  encapsulation: ViewEncapsulation.Emulated,
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
  _stateValue: ITreeState; // 组件状态

  _isOpen= false;
  _dropDownPosition = 'bottom';
  _triggerWidth = 0;

  @Input() nzTreeData: any= [];
  @Input() nzTreeKeys: any= {};
  @Input() nzLazyLoad = false;
  @Input() nzOptions: any;
  @Input() nzCheckable = true;
  @Input() nzShowLine = false;

  @Input() nzTreeCheckStrictly = false;


  selectedNodes: any= [];

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  writeValue(value: any) {

    if(this.nzCheckable){
      this.selectedNodes = value;
    }else{
      if(value){
        this.selectedNodes.push(value);

        const activeNodeIds = {};
        activeNodeIds[value] = true;
        const expandedNodeIds = {};
        expandedNodeIds[value] = true;

        this._stateValue = {
          ...this._stateValue,
          activeNodeIds,
          expandedNodeIds
        };
      }
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  @ViewChild(NzTreeComponent) tree: NzTreeComponent;
  @ViewChild('trigger') trigger;

  constructor(){
  }


  ngOnInit() {

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

  _openTreeView(){
    this._isOpen = true;
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

  getNodeName(id){
    const ids = this.nzTreeKeys.id;
    const names = this.nzTreeKeys.name;
    return this.nzTreeData.find((node)=> {
      return node[ids] === id
    })[names];
  }

  select(){
    debugger;

    if(this.nzCheckable){
      this.onChangeCallback(this.selectedNodes);
    }else{
      this.onChangeCallback(this.selectedNodes[0]);
    }
  }

  event(event){
    if(event.eventName == 'activate'){
      this.closeDropDown();
    }
  }

}
