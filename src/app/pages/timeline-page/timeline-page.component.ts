import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { HappenedCardComponent } from "../../components/happened-card/happened-card.component";
import { DatabaseService } from "../../database/database.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { v4 as uuid } from 'uuid';
import { Happened, HappenedDocument } from "../../database/models/happened";
import { MatDividerModule } from '@angular/material/divider';
import { RxDocument } from "rxdb";
import { map, tap } from "rxjs/operators";

@Component({
  standalone: true,
  templateUrl: './timeline-page.component.html',
  styleUrl: './timeline-page.component.scss',
  imports: [CommonModule, MatButtonModule, MatIconModule, HappenedCardComponent, MatDividerModule],
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
          var date = new Date(happen.happenedAt);
          const dateString = date.toLocaleDateString();
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
}