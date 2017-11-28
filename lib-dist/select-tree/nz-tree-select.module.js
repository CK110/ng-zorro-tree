import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTreeSelectComponent } from './nz-tree-select.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NzTreeModule } from '../tree/nz-tree.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule } from '@angular/forms';
import { NzTreeService } from '../providers/nz-tree.service';
var NzTreeSelectModule = (function () {
    function NzTreeSelectModule() {
    }
    NzTreeSelectModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        NzTreeSelectComponent
                    ],
                    imports: [
                        CommonModule,
                        NgZorroAntdModule.forRoot(),
                        NzTreeModule,
                        OverlayModule,
                        FormsModule
                    ],
                    exports: [
                        NzTreeSelectComponent
                    ],
                    providers: [
                        NzTreeService
                    ]
                },] },
    ];
    /** @nocollapse */
    NzTreeSelectModule.ctorParameters = function () { return []; };
    return NzTreeSelectModule;
}());
export { NzTreeSelectModule };
//# sourceMappingURL=nz-tree-select.module.js.map