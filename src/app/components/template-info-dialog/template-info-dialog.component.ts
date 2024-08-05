import { FormsModule } from "@angular/forms";
import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { HappenedTemplate } from "../../database/models/happened-template";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";

@Component({
    standalone: true,
    templateUrl: './template-info-dialog.component.html',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatFormFieldModule,
        MatInputModule,
        //MatSelectModule,
        MatButtonModule,
        FormsModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateInfoDialogComponent {

    dialogRef = inject(MatDialogRef<TemplateInfoDialogComponent>);
    data = inject<HappenedTemplate>(MAT_DIALOG_DATA);

    title = signal(this.data.title);

    result = computed(() => ({
        ...this.data,
        title: this.title(),
    }));

    close() {
        this.dialogRef.close();
    }
}