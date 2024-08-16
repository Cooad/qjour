import { ChangeDetectionStrategy, Component, computed, input, output } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'app-date-time',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <mat-form-field>
      <mat-label>{{this.label()}}</mat-label>
      <input matInput type="datetime-local" [value]="dateInput()" (change)="dateChangedInternal($event)" />
    </mat-form-field>
  `
})
export class DateTimeEditComponent {

  label = input.required<string>();

  date = input.required<Date>();
  dateChange = output<Date>();

  dateInput = computed(() => this.toDateString(this.date()));

  dateChangedInternal(evt: Event) {
    const dateString = (evt.target! as HTMLInputElement).value;
    const date = new Date(dateString);
    this.dateChange.emit(date);
  }

  private toDateString(date: Date): string {
    return (date.getFullYear().toString() + '-'
      + ("0" + (date.getMonth() + 1)).slice(-2) + '-'
      + ("0" + (date.getDate())).slice(-2))
      + 'T' + date.toTimeString().slice(0, 5);
  }
}