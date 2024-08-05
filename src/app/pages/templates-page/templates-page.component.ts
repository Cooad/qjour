import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { DatabaseService } from "../../database/database.service";
import { MatDialog } from "@angular/material/dialog";
import { lastValueFrom } from "rxjs";
import { v4 as uuid } from 'uuid';
import { HappenedTemplate } from "../../database/models/happened-template";
import { MatButtonModule } from "@angular/material/button";

@Component({
  standalone: true,
  templateUrl: './templates-page.component.html',
  imports: [MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesPageComponent {

  private databaseService = inject(DatabaseService);
  private matDialog = inject(MatDialog);

  private happenedTypesQuery = this.databaseService.db.happened_template.find().sort({ title: 'asc' });
  happenedTypes = toSignal(this.happenedTypesQuery.$, { initialValue: [] });

  async addType() {
    const newType: HappenedTemplate = {
      id: uuid(),
      title: '',
      type: 'simple',
      metadata: {},
      createdAt: new Date().getTime(),
      modifiedAt: new Date().getTime()
    };
    const templateInfoComponent = await import("../../components/template-info-dialog/template-info-dialog.component").then(x => x.TemplateInfoDialogComponent);
    const dialogRef = this.matDialog.open(templateInfoComponent, { data: newType });
    const result = await lastValueFrom(dialogRef.afterClosed())
    if (result === undefined)
      return;
    await this.databaseService.db.happened_template.insert(result);
  }
}