import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { HappenedCardComponent } from "../../components/happened-card/happened-card.component";
import { DatabaseService } from "../../database/database.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { v4 as uuid } from 'uuid';
import { Happened, HappenedDocument } from "../../database/models/happened";
import { MatDividerModule } from '@angular/material/divider';
import { map } from "rxjs/operators";
import { formatDate } from "@angular/common"
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { lastValueFrom } from "rxjs";

@Component({
  standalone: true,
  templateUrl: './timeline-page.component.html',
  styleUrl: './timeline-page.component.scss',
  imports: [MatButtonModule, MatDividerModule, HappenedCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelinePageComponent {

  private databaseService = inject(DatabaseService);
  private matDialog = inject(MatDialog);

  private happenedsQuery = this.databaseService.db.happened.find().sort({ happenedAt: 'desc' });
  happenedsByDay = toSignal(
    this.happenedsQuery.$.pipe(
      map(happens => {
        const result = [];
        let currentDateString: string = "";
        let dayResult: { key: string, happeneds: HappenedDocument[] } | null = null;
        for (let happen of happens) {
          const dateString = this.toDate(happen.happenedAt);
          if (currentDateString !== dateString) {
            dayResult = { key: dateString, happeneds: [happen] };
            result.push(dayResult);
            currentDateString = dateString;
            continue;
          }
          dayResult?.happeneds.push(happen);
        }
        return result;
      })
    ), { initialValue: [] }
  );

  private happenedTemplatesQuery = this.databaseService.db.happened_template.find().sort({ title: 'asc' });
  happenedTemplates = toSignal(this.happenedTemplatesQuery.$, { initialValue: [] });

  async addHappened(templateId: string) {
    const happenedTemplate = this.happenedTemplates().find(t => t.id == templateId);
    const date = new Date().getTime();
    const base = {
      id: uuid(),
      createdAt: date,
      modifiedAt: date,
      happenedAt: date
    };
    const newHappened: Happened = !!happenedTemplate
      ? {
        ...happenedTemplate._data,
        ...base
      }
      : {
        ...base,
        title: '',
        type: 'simple',
        metadata: {}
      };

    await this.databaseService.db.happened.insert(newHappened);
  }

  async editHappened(happened: HappenedDocument) {
    const happenedEditDialogComponent = await import("../../components/happened-edit-dialog/happened-edit-dialog.component").then(x => x.HappenedEditDialogComponent);
    const dialogRef = this.matDialog.open(happenedEditDialogComponent, { data: happened._data });
    const result = await lastValueFrom(dialogRef.afterClosed());
    if (!!result) {
      await happened.patch({
        ...result,
        modifiedAt: new Date().getTime()
      });
    }
  }

  deleteHappened(happened: HappenedDocument) {
    return happened.remove();
  }

  toDate(date: number) {
    return formatDate(date, "dd.MM.yyyy", 'en-US');
  }

  toTime(date: number) {
    return formatDate(date, "HH:mm", 'en-US');
  }
}