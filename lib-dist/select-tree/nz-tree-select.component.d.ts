import { OnInit, EventEmitter } from '@angular/core';
import { NzTreeComponent } from '../tree/nz-tree.component';
import { ITreeState } from 'angular-tree-component';
import { ControlValueAccessor } from '@angular/forms';
import { NzTreeService } from '../providers/nz-tree.service';
export declare class NzTreeSelectComponent implements OnInit, ControlValueAccessor {
    nzTreeService: NzTreeService;
    _isOpen: boolean;
    _dropDownPosition: string;
    _treeData: any;
    _triggerWidth: number;
    nzTreeData: any;
    nzTreeKeys: any;
    nzLazyLoad: boolean;
    nzOptions: any;
    selectedNodes: any;
    private onTouchedCallback;
    private onChangeCallback;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    tree: NzTreeComponent;
    trigger: any;
    constructor(nzTreeService: NzTreeService);
    stateValue: ITreeState;
    stateChange: EventEmitter<{}>;
    state: ITreeState;
    ngOnInit(): void;
    /**
     * TODO
     * @param i
     */
    deleteSelected(i: any): void;
    onEvent(event: any): void;
    refreshSelectedNodes(): void;
    _openTreeView(): void;
    closeDropDown(): void;
    onPositionChange(position: any): void;
    _setTriggerWidth(): void;
    change(event: any): void;
}
