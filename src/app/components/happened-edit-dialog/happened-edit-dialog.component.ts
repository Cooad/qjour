import { ChangeDetectionStrategy, Component, computed, effect, inject, Signal, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { Happened } from "../../database/models/happened";
import { MatIconModule } from "@angular/material/icon";
import { DateTimeEditComponent } from "../date-time-edit/date-time-edit.component";

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
        MatSelectModule,
        MatRadioModule,
        MatIconModule,
        FormsModule,
        DateTimeEditComponent 
    ],
    standalone: true
})
export class HappenedEditDialogComponent {
    dialogRef = inject(MatDialogRef<HappenedEditDialogComponent>);
    data = inject<Happened>(MAT_DIALOG_DATA);

    title = signal(this.data.title);
    happenedAt = signal(new Date(this.data.happenedAt));
    type = signal(this.data.type);
    metadata = signal<any>(this.data.metadata);

    result: Signal<Happened> = computed(() => ({
        ...this.data,
        title: this.title(),
        type: this.type(),
        metadata: this.metadata(),
        happenedAt: this.happenedAt().getTime()
    }));

    close() {
        this.dialogRef.close();
    }

    modifyMetadata(key: string, value: string | number) {
        this.metadata.update(m => ({ ...m, [key]: value }));
    }
}