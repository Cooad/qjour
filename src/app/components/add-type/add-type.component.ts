import { FormsModule } from "@angular/forms";
import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from '@angular/material/input';
import { HappenedType } from "../../models/happened-type";
import { MatButtonModule } from "@angular/material/button";

@Component({
    standalone: true,
    templateUrl: './add-type.component.html',
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        FormsModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTypeComponent {

    dialogRef = inject(MatDialogRef<AddTypeComponent>);
    data = inject<HappenedType>(MAT_DIALOG_DATA);

    title = signal(this.data.title);

    result = computed(() => ({
        ...this.data,
        title: this.title()
    }));

    close() {
        this.dialogRef.close();
    }
}