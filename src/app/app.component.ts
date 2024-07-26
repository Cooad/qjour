import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatabaseService } from './services/database/database.service';
import { merge, of, Subscription, lastValueFrom } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { UpdateAvailableComponent } from './components/update-available/update-available.component';
import { v4 as uuid } from 'uuid';
import { HappenedType } from './models/happened-type';
import { MatDialog } from '@angular/material/dialog';
import { AddTypeComponent } from './components/add-type/add-type.component';
import { HappenedCardComponent } from './components/happened-card/happened-card.component';
import { Happened } from './models/happened';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCardModule, CommonModule, MatButtonModule, MatIconModule, HappenedCardComponent, MatSidenavModule, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy {

  private happenedTypesQuery = this.databaseService.db.happened_types.find().sort({ title: 'asc' });
  happenedTypes = toSignal(this.happenedTypesQuery.$, { initialValue: [] });

  private happenedsQuery = this.databaseService.db.happened.find().sort({ happenedAt: 'desc' });
  happeneds = toSignal(this.happenedsQuery.$, { initialValue: [] });

  private updatesSub: Subscription | null;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;


  constructor(private databaseService: DatabaseService, private matDialog: MatDialog, updates: SwUpdate, matSnackBar: MatSnackBar, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);

    this.updatesSub = merge(
      updates.versionUpdates.pipe(
        filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY')),
      updates.unrecoverable
    ).pipe(switchMap((evt) => {
      if (evt?.type === 'UNRECOVERABLE_STATE')
        return of(true);
      const ref = matSnackBar.openFromComponent(UpdateAvailableComponent);
      return ref.afterDismissed().pipe(map(x => x.dismissedByAction));
    }))
      .subscribe(shouldReload => {
        if (shouldReload)
          location.reload();
      });
  }

  async addType() {
    const newType: HappenedType = {
      id: uuid(),
      title: '',
      metadataProperties: {},
      createdAt: new Date().getTime(),
      modifiedAt: new Date().getTime()
    };
    const dialogRef = this.matDialog.open(AddTypeComponent, { data: newType });
    const result = await lastValueFrom(dialogRef.afterClosed())
    if (result === undefined)
      return;
    await this.databaseService.db.happened_types.insert(result);
  }

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

  ngOnDestroy(): void {
    if (this.updatesSub) {
      this.updatesSub.unsubscribe();
      this.updatesSub = null;
    }
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
