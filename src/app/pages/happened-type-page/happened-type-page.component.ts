import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { DatabaseService } from "../../services/database/database.service";
import { MatDialog } from "@angular/material/dialog";
import { lastValueFrom } from "rxjs";
import { HappenedType } from "../../models/happened-type";
import { v4 as uuid } from 'uuid';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  standalone: true,
  templateUrl: './happened-type-page.component.html',
  imports: [MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HappenedTypePageComponent {

  private databaseService = inject(DatabaseService);
  private matDialog = inject(MatDialog);

  private happenedTypesQuery = this.databaseService.db.happened_types.find().sort({ title: 'asc' });
  happenedTypes = toSignal(this.happenedTypesQuery.$, { initialValue: [] });

  async addType() {
    const newType: HappenedType = {
      id: uuid(),
      title: '',
      metadataProperties: {},
      createdAt: new Date().getTime(),
      modifiedAt: new Date().getTime()
    };
    const addTypeComponent = await import("../../components/add-type/add-type.component").then(x => x.AddTypeComponent);
    const dialogRef = this.matDialog.open(addTypeComponent, { data: newType });
    //const dialogRef = this.matDialog.open(AddTypeComponent, { data: newType });
    const result = await lastValueFrom(dialogRef.afterClosed())
    if (result === undefined)
      return;
    await this.databaseService.db.happened_types.insert(result);
  }
}