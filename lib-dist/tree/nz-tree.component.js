import { Component, Input, Output, EventEmitter, ViewChild, ViewEncapsulation, ContentChild, forwardRef } from '@angular/core';
import { TreeComponent } from 'angular-tree-component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzTreeService } from '../providers/nz-tree.service';
var NzTreeComponent = (function () {
    function NzTreeComponent(nzTreeService) {
        this.nzTreeService = nzTreeService;
        //数据源key定义，匹配任何数据
        this.nzNodeKeys = {};
        this.nzLazyLoad = false;
        this.nzFlag = false; // 是否是嵌套对象，默认值为false
        this.nzCheckable = false;
        this.nzShowLine = false;
        this.nzToggleExpanded = new EventEmitter();
        this.nzActivate = new EventEmitter();
        this.nzDeactivate = new EventEmitter();
        this.nzFocus = new EventEmitter();
        this.nzBlur = new EventEmitter();
        this.nzUpdateData = new EventEmitter();
        this.nzInitialized = new EventEmitter();
        this.nzMoveNode = new EventEmitter();
        this.nzCopyNode = new EventEmitter();
        this.nzLoadNodeChildren = new EventEmitter();
        this.nzChangeFilter = new EventEmitter();
        this.nzEvent = new EventEmitter();
        this.nzStateChange = new EventEmitter();
        this.nzCheck = new EventEmitter();
        this.customStateChange = new EventEmitter();
        this.stateChange = new EventEmitter();
    }
    NzTreeComponent.prototype.sc = function (event) {
        this._state = event;
    };
    Object.defineProperty(NzTreeComponent.prototype, "state", {
        get: function () {
            return this.stateValue;
        },
        set: function (val) {
            this.stateValue = val;
            this.stateChange.emit(this.stateValue);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NzTreeComponent.prototype, "treeModel", {
        get: function () {
            return this.tree.treeModel;
        },
        enumerable: true,
        configurable: true
    });
    NzTreeComponent.prototype.toggleCheck = function (node) {
        if (node.data.disableCheckbox !== true) {
            node.data.checked = !node.data.checked;
            node.data.halfChecked = false;
            this.updateCheckState(node, node.data.checked);
            this.fireEvent({ eventName: 'check', node: node, checked: node.data.checked });
        }
    };
    NzTreeComponent.prototype.updateCheckState = function (node, checkIt) {
        var childLoop = function (parentNode) {
            if (!parentNode.children)
                return;
            for (var _i = 0, _a = parentNode.children; _i < _a.length; _i++) {
                var childNode = _a[_i];
                if (!childNode.data.disableCheckbox) {
                    childNode.data.halfChecked = false;
                    childNode.data.checked = checkIt;
                }
                childLoop(childNode);
            }
        };
        childLoop(node);
        var parentLoop = function (childNode) {
            if (!childNode.parent)
                return;
            var parentNode = childNode.parent;
            var childrenCount = parentNode.children.length;
            var checkedChildrenCount = 0;
            for (var _i = 0, _a = parentNode.children; _i < _a.length; _i++) {
                var item = _a[_i];
                if (item.data.disableCheckbox) {
                    childrenCount -= 1;
                    continue;
                }
                if (item.data.checked === true)
                    checkedChildrenCount++;
                else if (item.data.halfChecked === true)
                    checkedChildrenCount += 0.5;
            }
            if (checkedChildrenCount === childrenCount) {
                parentNode.data.checked = true;
                parentNode.data.halfChecked = false;
            }
            else if (checkedChildrenCount > 0) {
                parentNode.data.checked = false;
                parentNode.data.halfChecked = true;
            }
            else {
                parentNode.data.checked = false;
                parentNode.data.halfChecked = false;
            }
            parentLoop(parentNode);
        };
        parentLoop(node);
    };
    NzTreeComponent.prototype.fireEvent = function (event) {
        //
        var eventName = event && event.eventName;
        if (eventName && typeof eventName === 'string') {
            var emitEventName = 'nz' + (eventName.charAt(0).toUpperCase() + eventName.slice(1));
            var emitObj = this[emitEventName];
            if (this[emitEventName])
                this[emitEventName].emit(event);
        }
        this.nzEvent.emit(event);
    };
    NzTreeComponent.prototype.ngOnInit = function () {
        //如果和组件使用的默认key不一样
        if (!this.nzFlag) {
            if (this.nzNodeKeys) {
                this.nzNodes = this.nzTreeService.generateInnerNodes(this.nzNodes, this.nzNodeKeys, this.nzLazyLoad);
            }
            this.nzNodes = this.nzTreeService.generateNodes(this.nzNodes, this.nzLazyLoad);
        }
    };
    /**
     * 初始化完成后,模拟选中
     * 注意只能使用treemodel类型的，而非数据
     * @param $event
     */
    NzTreeComponent.prototype.initialized = function ($event) {
        var _this = this;
        var m = function (node) {
            if (node.data.checked)
                _this.updateCheckState(node, node.data.checked);
            node.children && node.children.forEach(function (node) {
                m(node);
            });
        };
        $event.treeModel.roots.forEach(function (node) {
            m(node);
        });
        this.nzInitialized.emit($event);
    };
    NzTreeComponent.prototype.ngOnChanges = function (changes) {
        this._options = Object.assign({
            animateExpand: true
        }, this.nzOptions);
    };
    NzTreeComponent.prototype.repair = function ($event) {
        var _this = this;
        if (!$event.node.data.children.length) {
            $event.node.data.hasChildren = false;
        }
        else {
            $event.node.children.forEach(function (node) {
                if (node.data.checked)
                    _this.updateCheckState(node, node.data.checked);
            });
        }
        this.nzLoadNodeChildren.emit($event);
        if (this.nzLazyLoad) {
            this.stateValue = this._state;
            this.customStateChange.emit(this.stateValue);
        }
    };
    NzTreeComponent.decorators = [
        { type: Component, args: [{
                    selector: 'nz-tree',
                    template: "\n    <tree-root *ngIf=\"!nzLazyLoad\" class=\"ant-tree\" [class.ant-tree-show-line]=\"nzShowLine\" [nodes]=\"nzNodes\" [options]=\"_options\"\n             [(state)]=\"state\"\n    (toggleExpanded)=\"fireEvent($event)\"\n    (activate)=\"fireEvent($event)\"\n    (deactivate)=\"fireEvent($event)\"\n    (focus)=\"fireEvent($event)\"\n    (blur)=\"fireEvent($event)\"\n    (updateData)=\"fireEvent($event)\"\n    (initialized)=\"initialized($event)\"\n    (moveNode)=\"fireEvent($event)\"\n    (copyNode)=\"fireEvent($event)\"\n    (loadNodeChildren)=\"repair($event)\"\n    (changeFilter)=\"fireEvent($event)\"\n    (stateChange)=\"fireEvent($event)\"> <!--\u72B6\u6001\u6539\u53D8-->\n    <ng-template #treeNodeFullTemplate let-node let-index=\"index\" let-templates=\"templates\">\n      <div\n        [class.ant-tree-node]=\"true\"\n        [class.ant-tree-node-expanded]=\"node.isExpanded && node.hasChildren\"\n        [class.ant-tree-node-collapsed]=\"node.isCollapsed && node.hasChildren\"\n        [class.ant-tree-node-leaf]=\"node.isLeaf\"\n        [class.ant-tree-node-active]=\"node.isActive\"\n        [class.ant-tree-node-focused]=\"node.isFocused\">\n        <tree-node-drop-slot *ngIf=\"index === 0\" [dropIndex]=\"node.index\" [node]=\"node.parent\"></tree-node-drop-slot>\n        <span\n          *ngIf=\"node.hasChildren\"\n          [class.ant-tree-switcher_open]=\"node.isExpanded\"\n          [class.ant-tree-switcher_close]=\"node.isCollapsed\"\n          class=\"ant-tree-switcher\"\n          (click)=\"node.mouseAction('expanderClick', $event)\"></span>\n        <span\n          *ngIf=\"!node.hasChildren\"\n          class=\"ant-tree-switcher ant-tree-switcher-noop\">\n        </span>\n        <span *ngIf=\"nzCheckable\"\n          class=\"ant-tree-checkbox\"\n          [class.ant-tree-checkbox-checked]=\"node.data.checked\"\n          [class.ant-tree-checkbox-disabled]=\"node.data.disableCheckbox\"\n          [class.ant-tree-checkbox-indeterminate]=\"node.data.halfChecked\"\n          (click)=\"toggleCheck(node)\">\n          <span class=\"ant-tree-checkbox-inner\"></span>\n        </span>\n        <span class=\"ant-tree-node-content-wrapper\"\n          [class.ant-tree-node-selected]=\"node.isActive\"\n          [class.ant-tree-node-content-wrapper-open]=\"node.isExpanded\"\n          [class.ant-tree-node-content-wrapper-close]=\"node.isCollapsed\"\n          (click)=\"node.mouseAction('click', $event)\"\n          (dblclick)=\"node.mouseAction('dblClick', $event)\"\n          (contextmenu)=\"node.mouseAction('contextMenu', $event)\"\n          (treeDrop)=\"node.onDrop($event)\"\n          (treeDropDragOver)=\"node.mouseAction('dragOver', $event)\"\n          (treeDropDragLeave)=\"node.mouseAction('dragLeave', $event)\"\n          (treeDropDragEnter)=\"node.mouseAction('dragEnter', $event)\"\n          [treeAllowDrop]=\"node.allowDrop\"\n          [treeDrag]=\"node\"\n          [treeDragEnabled]=\"node.allowDrag()\">\n          <span *ngIf=\"!nzTitle\" class=\"ant-tree-title\" [innerHTML]=\"node.displayField\"></span>\n          <ng-container\n            [ngTemplateOutlet]=\"nzTitle\"\n            [ngTemplateOutletContext]=\"{ node: node, index: index }\">\n          </ng-container>\n        </span>\n        <tree-node-children [node]=\"node\" [templates]=\"templates\"></tree-node-children>\n        <tree-node-drop-slot [dropIndex]=\"node.index + 1\" [node]=\"node.parent\"></tree-node-drop-slot>\n      </div>\n    </ng-template>\n    <ng-template #loadingTemplate let-node let-index=\"index\" let-templates=\"templates\"></ng-template>\n  </tree-root>\n    <!-- statechange \u4E4B\u540E\u624D\u89E6\u53D1 loadNodeChildren -->\n    <tree-root *ngIf=\"nzLazyLoad\" class=\"ant-tree\" [class.ant-tree-show-line]=\"nzShowLine\" [nodes]=\"nzNodes\" [options]=\"_options\"\n               [state]=\"state\"\n               (toggleExpanded)=\"fireEvent($event)\"\n               (activate)=\"fireEvent($event)\"\n               (deactivate)=\"fireEvent($event)\"\n               (focus)=\"fireEvent($event)\"\n               (blur)=\"fireEvent($event)\"\n               (updateData)=\"fireEvent($event)\"\n               (initialized)=\"initialized($event)\"\n               (moveNode)=\"fireEvent($event)\"\n               (copyNode)=\"fireEvent($event)\"\n               (loadNodeChildren)=\"repair($event)\"\n               (changeFilter)=\"fireEvent($event)\"\n               (stateChange)=\"sc($event)\"> <!--\u72B6\u6001\u6539\u53D8-->\n      <ng-template #treeNodeFullTemplate let-node let-index=\"index\" let-templates=\"templates\">\n        <div\n          [class.ant-tree-node]=\"true\"\n          [class.ant-tree-node-expanded]=\"node.isExpanded && node.hasChildren\"\n          [class.ant-tree-node-collapsed]=\"node.isCollapsed && node.hasChildren\"\n          [class.ant-tree-node-leaf]=\"node.isLeaf\"\n          [class.ant-tree-node-active]=\"node.isActive\"\n          [class.ant-tree-node-focused]=\"node.isFocused\">\n          <tree-node-drop-slot *ngIf=\"index === 0\" [dropIndex]=\"node.index\" [node]=\"node.parent\"></tree-node-drop-slot>\n          <span\n            *ngIf=\"node.hasChildren\"\n            [class.ant-tree-switcher_open]=\"node.isExpanded\"\n            [class.ant-tree-switcher_close]=\"node.isCollapsed\"\n            class=\"ant-tree-switcher\"\n            (click)=\"node.mouseAction('expanderClick', $event)\"></span>\n          <span\n            *ngIf=\"!node.hasChildren\"\n            class=\"ant-tree-switcher ant-tree-switcher-noop\">\n        </span>\n          <span *ngIf=\"nzCheckable\"\n                class=\"ant-tree-checkbox\"\n                [class.ant-tree-checkbox-checked]=\"node.data.checked\"\n                [class.ant-tree-checkbox-disabled]=\"node.data.disableCheckbox\"\n                [class.ant-tree-checkbox-indeterminate]=\"node.data.halfChecked\"\n                (click)=\"toggleCheck(node)\">\n          <span class=\"ant-tree-checkbox-inner\"></span>\n        </span>\n          <span class=\"ant-tree-node-content-wrapper\"\n                [class.ant-tree-node-selected]=\"node.isActive\"\n                [class.ant-tree-node-content-wrapper-open]=\"node.isExpanded\"\n                [class.ant-tree-node-content-wrapper-close]=\"node.isCollapsed\"\n                (click)=\"node.mouseAction('click', $event)\"\n                (dblclick)=\"node.mouseAction('dblClick', $event)\"\n                (contextmenu)=\"node.mouseAction('contextMenu', $event)\"\n                (treeDrop)=\"node.onDrop($event)\"\n                (treeDropDragOver)=\"node.mouseAction('dragOver', $event)\"\n                (treeDropDragLeave)=\"node.mouseAction('dragLeave', $event)\"\n                (treeDropDragEnter)=\"node.mouseAction('dragEnter', $event)\"\n                [treeAllowDrop]=\"node.allowDrop\"\n                [treeDrag]=\"node\"\n                [treeDragEnabled]=\"node.allowDrag()\">\n          <span *ngIf=\"!nzTitle\" class=\"ant-tree-title\" [innerHTML]=\"node.displayField\"></span>\n          <ng-container\n            [ngTemplateOutlet]=\"nzTitle\"\n            [ngTemplateOutletContext]=\"{ node: node, index: index }\">\n          </ng-container>\n        </span>\n          <tree-node-children [node]=\"node\" [templates]=\"templates\"></tree-node-children>\n          <tree-node-drop-slot [dropIndex]=\"node.index + 1\" [node]=\"node.parent\"></tree-node-drop-slot>\n        </div>\n      </ng-template>\n      <ng-template #loadingTemplate let-node let-index=\"index\" let-templates=\"templates\"></ng-template>\n    </tree-root>\n    \n  ",
                    encapsulation: ViewEncapsulation.None,
                    styles: ["@-webkit-keyframes antCheckboxEffect{0%{-webkit-transform:scale(1);transform:scale(1);opacity:.5}to{-webkit-transform:scale(1.6);transform:scale(1.6);opacity:0}}@keyframes antCheckboxEffect{0%{-webkit-transform:scale(1);transform:scale(1);opacity:.5}to{-webkit-transform:scale(1.6);transform:scale(1.6);opacity:0}}.ant-tree-checkbox{white-space:nowrap;cursor:pointer;outline:0;display:inline-block;line-height:1;position:relative;vertical-align:text-bottom}.ant-tree-checkbox-input:focus+.ant-tree-checkbox-inner,.ant-tree-checkbox-wrapper:hover .ant-tree-checkbox-inner,.ant-tree-checkbox:hover .ant-tree-checkbox-inner{border-color:#108ee9}.ant-tree-checkbox-checked:after{position:absolute;top:0;left:0;width:100%;height:100%;border-radius:2px;border:1px solid #108ee9;content:'';-webkit-animation:antCheckboxEffect .36s ease-in-out;animation:antCheckboxEffect .36s ease-in-out;-webkit-animation-fill-mode:both;animation-fill-mode:both;visibility:hidden}.ant-tree-checkbox-wrapper:hover .ant-tree-checkbox:after,.ant-tree-checkbox:hover:after{visibility:visible}.ant-tree-checkbox-inner{position:relative;top:0;left:0;display:block;width:14px;height:14px;border:1px solid #d9d9d9;border-radius:2px;background-color:#fff;-webkit-transition:all .3s;transition:all .3s}.ant-tree-checkbox-inner:after{-webkit-transform:rotate(45deg) scale(0);transform:rotate(45deg) scale(0);position:absolute;left:4px;top:1px;display:table;width:5px;height:8px;border:2px solid #fff;border-top:0;border-left:0;content:' ';-webkit-transition:all .1s cubic-bezier(.71,-.46,.88,.6);transition:all .1s cubic-bezier(.71,-.46,.88,.6)}.ant-tree-checkbox-input{position:absolute;left:0;z-index:1;cursor:pointer;opacity:0;filter:alpha(opacity=0);top:0;bottom:0;right:0;width:100%;height:100%}.ant-tree-checkbox-indeterminate .ant-tree-checkbox-inner:after{content:' ';-webkit-transform:scale(1);transform:scale(1);position:absolute;left:2px;top:5px;width:8px;height:1px}.ant-tree-checkbox-indeterminate.ant-tree-checkbox-disabled .ant-tree-checkbox-inner:after{border-color:rgba(0,0,0,.25)}.ant-tree-checkbox-checked .ant-tree-checkbox-inner:after{-webkit-transform:rotate(45deg) scale(1);transform:rotate(45deg) scale(1);position:absolute;left:4px;top:1px;display:table;width:5px;height:8px;border:2px solid #fff;border-top:0;border-left:0;content:' ';-webkit-transition:all .2s cubic-bezier(.12,.4,.29,1.46) .1s;transition:all .2s cubic-bezier(.12,.4,.29,1.46) .1s}.ant-tree-checkbox-checked .ant-tree-checkbox-inner,.ant-tree-checkbox-indeterminate .ant-tree-checkbox-inner{background-color:#108ee9;border-color:#108ee9}.ant-tree-checkbox-disabled,.ant-tree-checkbox-disabled .ant-tree-checkbox-input{cursor:not-allowed}.ant-tree-checkbox-disabled.ant-tree-checkbox-checked .ant-tree-checkbox-inner:after{-webkit-animation-name:none;animation-name:none;border-color:rgba(0,0,0,.25)}.ant-tree-checkbox-disabled .ant-tree-checkbox-inner{border-color:#d9d9d9!important;background-color:#f7f7f7}.ant-tree-checkbox-disabled .ant-tree-checkbox-inner:after{-webkit-animation-name:none;animation-name:none;border-color:#f7f7f7}.ant-tree-checkbox-disabled+span{color:rgba(0,0,0,.25);cursor:not-allowed}.ant-tree-checkbox-wrapper{cursor:pointer;font-size:12px;display:inline-block}.ant-tree-checkbox-wrapper:not(:last-child){margin-right:8px}.ant-tree-checkbox+span,.ant-tree-checkbox-wrapper+span{padding-left:8px;padding-right:8px}.ant-tree-checkbox-group{font-size:12px}.ant-tree-checkbox-group-item{display:inline-block}@media \\0screen{.ant-tree-checkbox-checked .ant-tree-checkbox-inner:after,.ant-tree-checkbox-checked .ant-tree-checkbox-inner:before{font-family:'anticon';text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;content:\"\\E632\";font-weight:700;font-size:8px;border:0;color:#fff;left:2px;top:3px;position:absolute}}.ant-tree{margin:0;padding:0;font-size:12px}.ant-tree span[draggable=true]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border-top:2px transparent solid;border-bottom:2px transparent solid;margin-top:-2px;-khtml-user-drag:element;-webkit-user-drag:element}.ant-tree .node-drop-slot{display:block;height:2px}.ant-tree .node-drop-slot.is-dragging-over{background-color:#108ee9}.ant-tree-node{padding:4px 0;margin:0;list-style:none;white-space:nowrap;outline:0;position:relative}.ant-tree-node .tree-children{margin:0;padding:0 0 0 18px;overflow:hidden}.ant-tree-node .tree-node-loading{position:absolute;left:1px;top:5px;background:#fff;-webkit-transition:all .3s;transition:all .3s;width:24px;height:24px;line-height:24px;display:inline-block;vertical-align:middle;text-align:center}.ant-tree span.ant-tree-icon_loading:after,.ant-tree-node .tree-node-loading:after{display:inline-block;font-family:'anticon';text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;content:\"\\E6AE\";-webkit-animation:loadingCircle 1s infinite linear;animation:loadingCircle 1s infinite linear;color:#108ee9}.ant-tree .ant-tree-node-content-wrapper{display:inline-block;padding:3px 5px;border-radius:2px;margin:0;cursor:pointer;text-decoration:none;vertical-align:top;color:rgba(0,0,0,.65);-webkit-transition:all .3s;transition:all .3s;position:relative}.ant-tree .ant-tree-node-content-wrapper:hover{background-color:#ecf6fd}.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected{background-color:#d2eafb}.ant-tree .ant-tree-node-content-wrapper.is-dragging-over{background-color:#108ee9;color:#fff;opacity:.8}.ant-tree span.ant-tree-checkbox{margin:0 4px 0 2px;vertical-align:middle}.ant-tree span.ant-tree-iconEle,.ant-tree span.ant-tree-switcher{margin:0;width:24px;height:24px;line-height:24px;display:inline-block;vertical-align:middle;border:0;cursor:pointer;outline:0;text-align:center}.ant-tree span.ant-tree-icon_loading{position:absolute;left:0;top:1px;background:#fff;-webkit-transform:translateX(-100%);transform:translateX(-100%);-webkit-transition:all .3s;transition:all .3s}.ant-tree span.ant-tree-switcher.ant-tree-switcher-noop{cursor:default}.ant-tree span.ant-tree-switcher.ant-tree-switcher_close:after,.ant-tree span.ant-tree-switcher.ant-tree-switcher_open:after{font-size:12px;font-size:7px \\9;-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=1, M12=0, M21=0, M22=1)\";zoom:1;display:inline-block;font-family:'anticon';text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;content:\"\\E606\";font-weight:700;-webkit-transition:-webkit-transform .3s;transition:transform .3s;transition:transform .3s,-webkit-transform .3s}.ant-tree span.ant-tree-switcher.ant-tree-switcher_open:after{-webkit-transform:scale(.58333333) rotate(0deg);transform:scale(.58333333) rotate(0deg)}:root .ant-tree span.ant-tree-switcher.ant-tree-switcher_open:after{-webkit-filter:none;filter:none;font-size:12px}.ant-tree span.ant-tree-switcher.ant-tree-switcher_close{-ms-filter:\"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\"}:root .ant-tree span.ant-tree-switcher.ant-tree-switcher_close:after{-webkit-filter:none;filter:none;font-size:12px}.ant-tree span.ant-tree-switcher.ant-tree-switcher_close:after{-webkit-transform:rotate(270deg) scale(.59);transform:rotate(270deg) scale(.59)}.ant-tree:last-child>span.ant-tree-iconEle:before,.ant-tree:last-child>span.ant-tree-switcher:before{display:none}.ant-tree.ant-tree-show-line .ant-tree-node{position:relative}.ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher{background:#fff;color:rgba(0,0,0,.65)}.ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher-noop:after{font-size:12px;font-size:12px \\9;-webkit-transform:scale(1) rotate(0deg);transform:scale(1) rotate(0deg);-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=1, M12=0, M21=0, M22=1)\";zoom:1;display:inline-block;font-family:'anticon';text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;content:\"\\E664\";vertical-align:baseline;font-weight:400;-webkit-transition:-webkit-transform .3s;transition:transform .3s;transition:transform .3s,-webkit-transform .3s}:root .ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher-noop:after{-webkit-filter:none;filter:none;font-size:12px}.ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher_close,.ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher_open{color:rgba(0,0,0,.43)}.ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher_open:after{font-size:12px;font-size:12px \\9;-webkit-transform:scale(1) rotate(0deg);transform:scale(1) rotate(0deg);-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=1, M12=0, M21=0, M22=1)\";zoom:1;display:inline-block;font-family:'anticon';text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;content:\"\\E621\";vertical-align:baseline;font-weight:400;-webkit-transition:-webkit-transform .3s;transition:transform .3s;transition:transform .3s,-webkit-transform .3s}:root .ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher_open:after{-webkit-filter:none;filter:none;font-size:12px}.ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher_close:after{font-size:12px;font-size:12px \\9;-webkit-transform:scale(1) rotate(0deg);transform:scale(1) rotate(0deg);-ms-filter:\"progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=1, M12=0, M21=0, M22=1)\";zoom:1;display:inline-block;font-family:'anticon';text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;content:\"\\E645\";vertical-align:baseline;font-weight:400;-webkit-transition:-webkit-transform .3s;transition:transform .3s;transition:transform .3s,-webkit-transform .3s}:root .ant-tree.ant-tree-show-line .ant-tree-node span.ant-tree-switcher.ant-tree-switcher_close:after{-webkit-filter:none;filter:none;font-size:12px}.ant-tree.ant-tree-show-line tree-node:not(:last-child) .ant-tree-node:before{content:' ';width:1px;border-left:1px solid #d9d9d9;height:100%;position:absolute;left:11px;margin:20px 0}"],
                    providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(function () { return NzTreeComponent; }),
                            multi: true
                        }
                    ],
                },] },
    ];
    /** @nocollapse */
    NzTreeComponent.ctorParameters = function () { return [
        { type: NzTreeService, },
    ]; };
    NzTreeComponent.propDecorators = {
        'nzNodeKeys': [{ type: Input },],
        'nzLazyLoad': [{ type: Input },],
        'nzFlag': [{ type: Input },],
        'nzNodes': [{ type: Input },],
        'nzCheckable': [{ type: Input },],
        'nzShowLine': [{ type: Input },],
        'nzOptions': [{ type: Input },],
        'nzTitle': [{ type: ContentChild, args: ['nzTitle',] },],
        'nzLoading': [{ type: ContentChild, args: ['nzLoading',] },],
        'nzToggleExpanded': [{ type: Output },],
        'nzActivate': [{ type: Output },],
        'nzDeactivate': [{ type: Output },],
        'nzFocus': [{ type: Output },],
        'nzBlur': [{ type: Output },],
        'nzUpdateData': [{ type: Output },],
        'nzInitialized': [{ type: Output },],
        'nzMoveNode': [{ type: Output },],
        'nzCopyNode': [{ type: Output },],
        'nzLoadNodeChildren': [{ type: Output },],
        'nzChangeFilter': [{ type: Output },],
        'nzEvent': [{ type: Output },],
        'nzStateChange': [{ type: Output },],
        'nzCheck': [{ type: Output },],
        'customStateChange': [{ type: Output },],
        'tree': [{ type: ViewChild, args: [TreeComponent,] },],
        'stateChange': [{ type: Output },],
        'state': [{ type: Input },],
    };
    return NzTreeComponent;
}());
export { NzTreeComponent };
//# sourceMappingURL=nz-tree.component.js.map