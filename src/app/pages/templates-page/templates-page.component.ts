import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { DatabaseService } from "../../database/database.service";
import { MatDialog } from "@angular/material/dialog";
import { lastValueFrom } from "rxjs";
import { v4 as uuid } from 'uuid';
import { HappenedTemplate, HappenedTemplateDocument } from "../../database/models/happened-template";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
  standalone: true,
  templateUrl: './templates-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule
  ]
})
export class TemplatesPageComponent {

  private databaseService = inject(DatabaseService);
  private matDialog = inject(MatDialog);

  private happenedTemplatesQuery = this.databaseService.db.happened_template.find().sort({ title: 'asc' });
  happenedTemplates = toSignal(this.happenedTemplatesQuery.$, { initialValue: [] });

  async addTemplate() {
    const newType: HappenedTemplate = {
      id: uuid(),
      title: '',
      type: 'simple',
      metadata: {},
      createdAt: new Date().getTime(),
      modifiedAt: new Date().getTime()
    };
    const templateInfoComponent = await import("../../components/template-edit-dialog/template-edit-dialog.component").then(x => x.TemplateInfoDialogComponent);
    const dialogRef = this.matDialog.open(templateInfoComponent, { data: newType });
    const result = await lastValueFrom(dialogRef.afterClosed())
    if (result === undefined)
      return;
    await this.databaseService.db.happened_template.insert(result);
  }

  async editTemplate(happenedTemplate: HappenedTemplateDocument) {
    const currentData = happenedTemplate._data;
    const templateEditComponent = await import("../../components/template-edit-dialog/template-edit-dialog.component").then(x => x.TemplateInfoDialogComponent);
    const dialogRef = this.matDialog.open(templateEditComponent, { data: currentData })
    const result = await lastValueFrom(dialogRef.afterClosed());
    if (result === undefined)
      return;
    await happenedTemplate.patch({
      ...result,
      modifiedAt: new Date().getTime()
    });
  }

  async deleteTemplate(happenedTemplate: HappenedTemplateDocument){
    happenedTemplate.remove();
  }
}