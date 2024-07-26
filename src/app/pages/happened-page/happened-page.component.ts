import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { HappenedCardComponent } from "../../components/happened-card/happened-card.component";
import { DatabaseService } from "../../services/database/database.service";
import { toSignal } from "@angular/core/rxjs-interop";
import { v4 as uuid } from 'uuid';
import { Happened } from "../../models/happened";
import { MatDividerModule } from '@angular/material/divider';

@Component({
  standalone: true,
  templateUrl: './happened-page.component.html',
  styleUrl: './happened-page.component.scss',
  imports: [CommonModule, MatButtonModule, MatIconModule, HappenedCardComponent, MatDividerModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HappenedPageComponent {

  private databaseService = inject(DatabaseService);
  private happenedsQuery = this.databaseService.db.happened.find().sort({ happenedAt: 'desc' });
  happeneds = toSignal(this.happenedsQuery.$, { initialValue: [] });

  private happenedTypesQuery = this.databaseService.db.happened_types.find().sort({ title: 'asc' });
  happenedTypes = toSignal(this.happenedTypesQuery.$, { initialValue: [] });

  async addHappened(typeId: string) {
    const newHappened: Happened = {
      id: uuid(),
      type: typeId,
      metadata: {},
      createdAt: new Date().getTime(),
      modifiedAt: new Date().getTime(),
      happenedAt: new Date().getTime()
    };
    await this.databaseService.db.happened.insert(newHappened);
  }
}