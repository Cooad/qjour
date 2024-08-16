import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HappenedTemplate } from "../../database/models/happened-template";
import { TemplateEditComponent } from "../template-edit/template-edit.component";

@Component({
    templateUrl: './template-edit-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        TemplateEditComponent
    ],
    standalone: true
})
export class TemplateInfoDialogComponent {
    dialogRef = inject(MatDialogRef<TemplateInfoDialogComponent>);
    data = inject<HappenedTemplate>(MAT_DIALOG_DATA);

    template = signal(this.data);

    close() {
        this.dialogRef.close();
    }
}

