import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { Happened } from "../../database/models/happened";
import { throwIfIsStorageWriteError } from "rxdb";

@Component({
    templateUrl: './happened-edit-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatDialogTitle,
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule
    ],
    standalone: true
})
export class HappenedEditDialogComponent {
    dialogRef = inject(MatDialogRef<HappenedEditDialogComponent>);
    data = inject<Happened>(MAT_DIALOG_DATA);

    title = signal(this.data.title);
    happenedAt = signal(new Date(this.data.happenedAt));

    happenedInput = computed(() => this.toDateString(this.happenedAt()));

    result = computed(() => ({
        ...this.data,
        title: this.title(),
        happenedAt: this.happenedAt().getTime()
    }));

    close() {
        this.dialogRef.close();
    }

    happenedAtChanged(evt: Event) {
        const dateString = (evt.target! as HTMLInputElement).value;
        let date = new Date(dateString);
        this.happenedAt.set(date);
    }

    private toDateString(date: Date): string {
        return (date.getFullYear().toString() + '-' 
           + ("0" + (date.getMonth() + 1)).slice(-2) + '-' 
           + ("0" + (date.getDate())).slice(-2))
           + 'T' + date.toTimeString().slice(0,5);
    }
}