import {Component, ViewEncapsulation, OnInit, ViewChild, Input, ChangeDetectorRef, forwardRef, Output, EventEmitter} from '@angular/core';
import {NzTreeComponent} from '../tree/nz-tree.component';
import {DropDownAnimation} from 'ng-zorro-antd/src/core/animation/dropdown-animations';
import {ITreeState} from 'angular-tree-component';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {noop} from 'rxjs/util/noop';

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
  styles: [`.ant-select,.ant-select-arrow{display:inline-block;font-size:12px}.ant-select{-webkit-box-sizing:border-box;box-sizing:border-box;color:rgba(0,0,0,.65);position:relative}.ant-select>ul>li>a{padding:0;background-color:#fff}.ant-select-arrow{font-style:normal;vertical-align:baseline;text-align:center;text-transform:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;position:absolute;top:50%;right:8px;line-height:1;margin-top:-6px;font-size:9px \\9;-webkit-transform:scale(.75) rotate(0deg);transform:scale(.75) rotate(0deg);-ms-filter:"progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=1, M12=0, M21=0, M22=1)";zoom:1}.ant-select-arrow:before{display:block;font-family:"anticon"!important;content:'\\e61d';-webkit-transition:-webkit-transform .2s ease;transition:transform .2s ease;transition:transform .2s ease,-webkit-transform .2s ease}:root .ant-select-arrow{-webkit-filter:none;filter:none;font-size:12px}.ant-select-arrow *{display:none}.ant-select-selection{outline:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-box-sizing:border-box;box-sizing:border-box;display:block;background-color:#fff;border-radius:4px;border:1px solid #d9d9d9;-webkit-transition:all .3s cubic-bezier(.645,.045,.355,1);transition:all .3s cubic-bezier(.645,.045,.355,1)}.ant-select-selection:hover{border-color:#49a9ee}.ant-select-focused .ant-select-selection,.ant-select-selection:active,.ant-select-selection:focus{border-color:#49a9ee;outline:0;-webkit-box-shadow:0 0 0 2px rgba(16,142,233,.2);box-shadow:0 0 0 2px rgba(16,142,233,.2)}.ant-select-selection__clear{display:inline-block;font-style:normal;vertical-align:baseline;text-align:center;text-transform:none;text-rendering:auto;opacity:0;position:absolute;right:8px;z-index:1;background:#fff;top:50%;font-size:12px;color:rgba(0,0,0,.25);width:12px;height:12px;margin-top:-6px;line-height:12px;cursor:pointer;-webkit-transition:color .3s ease,opacity .15s ease;transition:color .3s ease,opacity .15s ease}.ant-select-selection__clear:before{display:block;font-family:'anticon';text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;content:"\\e62e"}.ant-select-selection__clear:hover{color:rgba(0,0,0,.43)}.ant-select-selection:hover .ant-select-selection__clear{opacity:1}.ant-select-selection-selected-value{float:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%;padding-right:14px}.ant-select-disabled{color:rgba(0,0,0,.25)}.ant-select-disabled .ant-select-selection{background:#f7f7f7;cursor:not-allowed}.ant-select-disabled .ant-select-selection:active,.ant-select-disabled .ant-select-selection:focus,.ant-select-disabled .ant-select-selection:hover{border-color:#d9d9d9;-webkit-box-shadow:none;box-shadow:none}.ant-select-disabled .ant-select-selection__clear{display:none;visibility:hidden;pointer-events:none}.ant-select-disabled .ant-select-selection--multiple .ant-select-selection__choice{background:#eee;color:#aaa;padding-right:10px}.ant-select-disabled .ant-select-selection--multiple .ant-select-selection__choice__remove{display:none}.ant-select-selection--single{height:28px;position:relative;cursor:pointer}.ant-select-selection__rendered{display:block;margin-left:7px;margin-right:7px;position:relative;line-height:26px}.ant-select-selection__rendered:after{content:'.';visibility:hidden;pointer-events:none;display:inline-block;width:0}.ant-select-lg .ant-select-selection--single{height:32px}.ant-select-lg .ant-select-selection__rendered{line-height:30px}.ant-select-lg .ant-select-selection--multiple{min-height:32px}.ant-select-lg .ant-select-selection--multiple .ant-select-selection__rendered li{height:24px;line-height:24px}.ant-select-lg .ant-select-selection--multiple .ant-select-selection__clear{top:16px}.ant-select-sm .ant-select-selection--single{height:22px}.ant-select-sm .ant-select-selection__rendered{line-height:20px}.ant-select-sm .ant-select-selection--multiple{min-height:22px}.ant-select-sm .ant-select-selection--multiple .ant-select-selection__rendered li{height:14px;line-height:14px}.ant-select-sm .ant-select-selection--multiple .ant-select-selection__clear{top:11px}.ant-select-disabled .ant-select-selection__choice__remove{color:rgba(0,0,0,.25);cursor:default}.ant-select-disabled .ant-select-selection__choice__remove:hover{color:rgba(0,0,0,.25)}.ant-select-search__field__wrap{display:inline-block;position:relative}.ant-select-search__field__placeholder,.ant-select-selection__placeholder{position:absolute;top:50%;left:0;right:9px;color:rgba(0,0,0,.25);line-height:20px;height:20px;max-width:100%;margin-top:-10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}.ant-select-search__field__placeholder{left:8px}.ant-select-search--inline{position:absolute;height:100%;width:100%}.ant-select-selection--multiple .ant-select-search--inline{float:left;position:static}.ant-select-search--inline .ant-select-search__field__wrap{width:100%;height:100%}.ant-select-search--inline .ant-select-search__field{border-width:0;font-size:100%;height:100%;width:100%;background:0 0;outline:0;border-radius:4px}.ant-select-search--inline .ant-select-search__field__mirror{position:absolute;top:0;left:-9999px;white-space:pre;pointer-events:none}.ant-select-search--inline>i{float:right}.ant-select-selection--multiple{min-height:28px;cursor:text;padding-bottom:3px;zoom:1}.ant-select-selection--multiple:after,.ant-select-selection--multiple:before{content:" ";display:table}.ant-select-selection--multiple:after{clear:both;visibility:hidden;font-size:0;height:0}.ant-select-selection--multiple .ant-select-search--inline{width:auto;padding:0;max-width:100%}.ant-select-selection--multiple .ant-select-search--inline .ant-select-search__field{max-width:100%;width:.75em}.ant-select-selection--multiple .ant-select-selection__rendered{margin-left:5px;margin-bottom:-3px;height:auto}.ant-select-selection--multiple .ant-select-selection__rendered>ul>li,.ant-select-selection--multiple>ul>li{margin-top:3px;height:20px;line-height:20px}.ant-select-selection--multiple .ant-select-selection__choice{color:rgba(0,0,0,.65);background-color:#f3f3f3;border-radius:4px;cursor:default;float:left;margin-right:4px;max-width:99%;position:relative;overflow:hidden;-webkit-transition:padding .3s cubic-bezier(.645,.045,.355,1);transition:padding .3s cubic-bezier(.645,.045,.355,1);padding:0 20px 0 10px}.ant-select-selection--multiple .ant-select-selection__choice__disabled{padding:0 10px}.ant-select-selection--multiple .ant-select-selection__choice__content{display:inline-block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;-webkit-transition:margin .3s cubic-bezier(.645,.045,.355,1);transition:margin .3s cubic-bezier(.645,.045,.355,1)}.ant-select-selection--multiple .ant-select-selection__choice__remove{font-style:normal;vertical-align:baseline;text-align:center;text-transform:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:rgba(0,0,0,.43);line-height:inherit;cursor:pointer;font-weight:700;-webkit-transition:all .3s cubic-bezier(.645,.045,.355,1);transition:all .3s cubic-bezier(.645,.045,.355,1);display:inline-block;font-size:12px;font-size:8px \\9;-webkit-transform:scale(.66666667) rotate(0deg);transform:scale(.66666667) rotate(0deg);-ms-filter:"progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=1, M12=0, M21=0, M22=1)";zoom:1;position:absolute;right:4px;padding:0 0 0 8px}.ant-select-selection--multiple .ant-select-selection__choice__remove:before{display:block;font-family:"anticon"!important;content:"\\e633"}:root .ant-select-selection--multiple .ant-select-selection__choice__remove{-webkit-filter:none;filter:none;font-size:12px}.ant-select-selection--multiple .ant-select-selection__choice__remove:hover{color:#404040}.ant-select-selection--multiple .ant-select-selection__clear{top:14px}.ant-select-allow-clear .ant-select-selection--multiple .ant-select-selection__rendered,.ant-select-combobox.ant-select-allow-clear .ant-select-selection:hover .ant-select-selection__rendered{margin-right:20px}.ant-select-open .ant-select-arrow{-ms-filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)";-ms-transform:rotate(180deg)}.ant-select-open .ant-select-arrow:before{-webkit-transform:rotate(180deg);transform:rotate(180deg)}.ant-select-open .ant-select-selection{border-color:#49a9ee;outline:0;-webkit-box-shadow:0 0 0 2px rgba(16,142,233,.2);box-shadow:0 0 0 2px rgba(16,142,233,.2)}.ant-select-combobox .ant-select-arrow{display:none}.ant-select-combobox .ant-select-search--inline{height:100%;width:100%;float:none}.ant-select-combobox .ant-select-search__field__wrap{width:100%;height:100%}.ant-select-combobox .ant-select-search__field{width:100%;height:100%;position:relative;z-index:1;-webkit-transition:all .3s cubic-bezier(.645,.045,.355,1);transition:all .3s cubic-bezier(.645,.045,.355,1);-webkit-box-shadow:none;box-shadow:none}.ant-select-dropdown{background-color:#fff;-webkit-box-shadow:0 1px 6px rgba(0,0,0,.2);box-shadow:0 1px 6px rgba(0,0,0,.2);border-radius:4px;-webkit-box-sizing:border-box;box-sizing:border-box;z-index:1050;outline:0;overflow:hidden;font-size:12px}.ant-select-dropdown.slide-up-appear.slide-up-appear-active.ant-select-dropdown-placement-bottomLeft,.ant-select-dropdown.slide-up-enter.slide-up-enter-active.ant-select-dropdown-placement-bottomLeft{-webkit-animation-name:antSlideUpIn;animation-name:antSlideUpIn}.ant-select-dropdown.slide-up-appear.slide-up-appear-active.ant-select-dropdown-placement-topLeft,.ant-select-dropdown.slide-up-enter.slide-up-enter-active.ant-select-dropdown-placement-topLeft{-webkit-animation-name:antSlideDownIn;animation-name:antSlideDownIn}.ant-select-dropdown.slide-up-leave.slide-up-leave-active.ant-select-dropdown-placement-bottomLeft{-webkit-animation-name:antSlideUpOut;animation-name:antSlideUpOut}.ant-select-dropdown.slide-up-leave.slide-up-leave-active.ant-select-dropdown-placement-topLeft{-webkit-animation-name:antSlideDownOut;animation-name:antSlideDownOut}.ant-select-dropdown-hidden{display:none}.ant-select-dropdown-menu{outline:0;margin-bottom:0;padding-left:0;list-style:none;max-height:250px;overflow:auto}.ant-select-dropdown-menu-item-group-list{margin:0;padding:0}.ant-select-dropdown-menu-item-group-list>.ant-select-dropdown-menu-item{padding-left:16px}.ant-select-dropdown-menu-item-group-title{color:rgba(0,0,0,.43);line-height:1.5;padding:8px}.ant-select-dropdown-menu-item{position:relative;display:block;padding:7px 8px;font-weight:400;color:rgba(0,0,0,.65);white-space:nowrap;cursor:pointer;overflow:hidden;-webkit-transition:background .3s ease;transition:background .3s ease}.ant-select-dropdown-menu-item-active,.ant-select-dropdown-menu-item:hover{background-color:#ecf6fd}.ant-select-dropdown-menu-item-disabled{color:rgba(0,0,0,.25);cursor:not-allowed}.ant-select-dropdown-menu-item-disabled:hover{color:rgba(0,0,0,.25);background-color:#fff;cursor:not-allowed}.ant-select-dropdown-menu-item-selected,.ant-select-dropdown-menu-item-selected:hover{background-color:#f7f7f7;font-weight:700;color:rgba(0,0,0,.65)}.ant-select-dropdown-menu-item-divider{height:1px;margin:1px 0;overflow:hidden;background-color:#e5e5e5;line-height:0}.ant-select-dropdown.ant-select-dropdown--multiple .ant-select-dropdown-menu-item:after{font-family:'anticon';text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;content:"\\e632";color:transparent;display:inline-block;font-size:12px;font-size:10px \\9;-webkit-transform:scale(.83333333) rotate(0deg);transform:scale(.83333333) rotate(0deg);-ms-filter:"progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=1, M12=0, M21=0, M22=1)";zoom:1;-webkit-transition:all .2s ease;transition:all .2s ease;position:absolute;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);right:8px;font-weight:700;text-shadow:0 .1px 0,.1px 0 0,0 -.1px 0,-.1px 0}:root .ant-select-dropdown.ant-select-dropdown--multiple .ant-select-dropdown-menu-item:after{-webkit-filter:none;filter:none;font-size:12px}.ant-select-dropdown.ant-select-dropdown--multiple .ant-select-dropdown-menu-item:hover:after{color:#ddd}.ant-select-dropdown.ant-select-dropdown--multiple .ant-select-dropdown-menu-item-disabled:after{display:none}.ant-select-dropdown.ant-select-dropdown--multiple .ant-select-dropdown-menu-item-selected:after,.ant-select-dropdown.ant-select-dropdown--multiple .ant-select-dropdown-menu-item-selected:hover:after{color:#108ee9;display:inline-block}.ant-select-dropdown-container-open .ant-select-dropdown,.ant-select-dropdown-open .ant-select-dropdown{display:block}nz-select .ant-select{width:100%}.ant-select-dropdown{top:100%;left:0;position:relative;width:100%;margin-top:4px;margin-bottom:4px}.ant-select-dropdown.ant-select-dropdown-placement-topLeft{top:-100%;-webkit-transform:translateY(-100%)!important;transform:translateY(-100%)!important}.ant-select-dropdown-menu-item{line-height:1.5}`],
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

  constructor(){

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
    if (this.nzTreeKeys){
      this._treeData = this.generateInnerNodes(this.nzTreeData, this.nzTreeKeys);
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

  /**
   * 生成符合组件规定的key
   * @param nodes
   * @returns {Array}
   */
  generateInnerNodes(nodes: any, nzNodeKeys: any){
    const tnodes = [];
    nodes.forEach((node) => {
      tnodes.push({
        'pid': node[nzNodeKeys['pid']],
        'id': node[nzNodeKeys['id']],
        'name': node[nzNodeKeys['name']],
        'checked': node[nzNodeKeys['checked']],
        'disableCheckbox': node[nzNodeKeys['disableCheckbox']],
      });
    });
    return tnodes;
  }

  /**
   * 生成需要的node结构
   * @param nodes
   * @returns {any}
   */
  generateNodes(nodes: any){
    const targetNodes: any = [];

    nodes.forEach((node) => {
      const targetNode = {};
      //没有父节点
      if (node.pid == ''){
        targetNode['pid'] = node.pid;
        targetNode['id'] = node.id;
        targetNode['name'] = node.name;

        if (this.nzLazyLoad){
          targetNode['hasChildren'] = true;
        }

        targetNode['checked'] = node.checked;
        targetNode['disableCheckbox'] = node.disableCheckbox;
        targetNodes.push(targetNode);
      }
    });

    return this.generateChildren(targetNodes, nodes);
  }

  generateChildren(targetNodes, nodes){
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
          childNode['checked'] = node.checked;
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

  change(event){
    this.stateValue = event;
  }

}
