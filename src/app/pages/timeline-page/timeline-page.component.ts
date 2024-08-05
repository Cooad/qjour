import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { HappenedCardComponent } from "../../components/happened-card/happened-card.component";
import { DatabaseService } from "../../database/database.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { v4 as uuid } from 'uuid';
import { Happened, HappenedDocument } from "../../database/models/happened";
import { MatDividerModule } from '@angular/material/divider';
import { RxDocument } from "rxdb";
import { map } from "rxjs/operators";
import { formatDate } from "@angular/common"
import { MatButtonModule } from "@angular/material/button";

@Component({
  standalone: true,
  templateUrl: './timeline-page.component.html',
  styleUrl: './timeline-page.component.scss',
  imports: [MatButtonModule, MatDividerModule, HappenedCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelinePageComponent {

  private databaseService = inject(DatabaseService);
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
    const newHappened: Happened = {
      id: uuid(),
      createdAt: new Date().getTime(),
      modifiedAt: new Date().getTime(),
      happenedAt: new Date().getTime(),
      title: happenedTemplate?.title ?? '',
      metadata: happenedTemplate?.metadata ?? {},
      type: happenedTemplate?.type ?? 'simple'
    };
    await this.databaseService.db.happened.insert(newHappened);
  }

  deleteHappened(happened: RxDocument<Happened>) {
    return happened.remove();
  }

  toDate(date: number) {
    return formatDate(date, "dd.MM.yyyy", 'en-US');
  }

  toTime(date: number) {
    return formatDate(date, "HH:mm", 'en-US');
  }
}