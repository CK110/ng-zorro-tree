import { OnInit, EventEmitter } from '@angular/core';
import { NzTreeComponent } from '../tree/nz-tree.component';
import { ITreeState } from 'angular-tree-component';
import { ControlValueAccessor } from '@angular/forms';
export declare class NzTreeSelectComponent implements OnInit, ControlValueAccessor {
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
    constructor();
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
    /**
     * 生成符合组件规定的key
     * @param nodes
     * @returns {Array}
     */
    generateInnerNodes(nodes: any, nzNodeKeys: any): any[];
    /**
     * 生成需要的node结构
     * @param nodes
     * @returns {any}
     */
    generateNodes(nodes: any): any;
    generateChildren(targetNodes: any, nodes: any): any;
    change(event: any): void;
}
