import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Happened } from "../../database/models/happened";
import { DateTimeEditComponent } from "../date-time-edit/date-time-edit.component";
import { TemplateEditComponent } from "../template-edit/template-edit.component";

@Component({
    templateUrl: './happened-edit-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        DateTimeEditComponent,
        TemplateEditComponent
    ],
    standalone: true
})
export class HappenedEditDialogComponent {
    dialogRef = inject(MatDialogRef<HappenedEditDialogComponent>);
    data = inject<Happened>(MAT_DIALOG_DATA);

    template = signal(this.data);
    happenedAt = signal(new Date(this.data.happenedAt));

    result: Signal<Happened> = computed(() => ({
        ...this.data,
        ...this.template(),
        happenedAt: this.happenedAt().getTime()
    }));

    close() {
        this.dialogRef.close();
    }
}