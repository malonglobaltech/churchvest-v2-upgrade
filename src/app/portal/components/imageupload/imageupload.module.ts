import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ImageuploadComponent } from "./imageupload.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { AngularMaterialModule } from "src/app/shared/angular-material.module";

@NgModule({
    declarations: [ImageuploadComponent],
    imports: [
        CommonModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        ToastrModule.forRoot({
            positionClass: "toast-top-right",
        }),
    ],
    providers: [{ provide: ToastrService }],
    exports: [ImageuploadComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ImageuploadModule {}
