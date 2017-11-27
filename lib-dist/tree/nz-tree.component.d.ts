import { OnChanges, SimpleChanges, EventEmitter, TemplateRef, OnInit } from '@angular/core';
import { ITreeState, TreeComponent, TreeModel, TreeNode } from 'angular-tree-component';
import { NzTreeOptions } from './nz-tree.options';
import { NzTreeService } from '../providers/nz-tree.service';
export declare class NzTreeComponent implements OnInit, OnChanges {
    nzTreeService: NzTreeService;
    _options: NzTreeOptions;
    nzNodeKeys: {};
    nzLazyLoad: boolean;
    nzFlag: boolean;
    nzNodes: any[];
    nzCheckable: boolean;
    nzShowLine: boolean;
    nzOptions: any;
    nzTitle: TemplateRef<any>;
    nzLoading: TemplateRef<any>;
    nzToggleExpanded: EventEmitter<{}>;
    nzActivate: EventEmitter<{}>;
    nzDeactivate: EventEmitter<{}>;
    nzFocus: EventEmitter<{}>;
    nzBlur: EventEmitter<{}>;
    nzUpdateData: EventEmitter<{}>;
    nzInitialized: EventEmitter<{}>;
    nzMoveNode: EventEmitter<{}>;
    nzCopyNode: EventEmitter<{}>;
    nzLoadNodeChildren: EventEmitter<{}>;
    nzChangeFilter: EventEmitter<{}>;
    nzEvent: EventEmitter<{}>;
    nzStateChange: EventEmitter<{}>;
    nzCheck: EventEmitter<{}>;
    customStateChange: EventEmitter<{}>;
    tree: TreeComponent;
    constructor(nzTreeService: NzTreeService);
    _state: ITreeState;
    sc(event: any): void;
    stateValue: ITreeState;
    stateChange: EventEmitter<{}>;
    state: ITreeState;
    readonly treeModel: TreeModel;
    toggleCheck(node: TreeNode): void;
    private updateCheckState(node, checkIt);
    fireEvent(event: any): void;
    ngOnInit(): void;
    /**
     * 初始化完成后,模拟选中
     * 注意只能使用treemodel类型的，而非数据
     * @param $event
     */
    initialized($event: any): void;
    ngOnChanges(changes: SimpleChanges): void;
    [key: string]: any;
    repair($event: any): void;
}
