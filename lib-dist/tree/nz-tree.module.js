import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTreeComponent } from './nz-tree.component';
import { TreeModule } from 'angular-tree-component';
import { NzTreeService } from '../providers/nz-tree.service';
var NzTreeModule = (function () {
    function NzTreeModule() {
    }
    NzTreeModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        NzTreeComponent,
                    ],
                    imports: [
                        CommonModule,
                        TreeModule
                    ],
                    exports: [
                        NzTreeComponent
                    ],
                    providers: [
                        NzTreeService
                    ]
                },] },
    ];
    /** @nocollapse */
    NzTreeModule.ctorParameters = function () { return []; };
    return NzTreeModule;
}());
export { NzTreeModule };
//# sourceMappingURL=nz-tree.module.js.map