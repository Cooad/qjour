import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatabaseService } from './services/database/database.service';
import { merge, Subject, Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { UpdateAvailableComponent } from './components/update-available/update-available.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCardModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy {

  private happenedTypeQuery = this.databaseService.db.happened_types.find().sort({ title: 'asc' });
  happenedTypes = toSignal(this.happenedTypeQuery.$, { initialValue: [] });

  updatesSub: Subscription | null;
  testSnackbar = new Subject<void>();

  constructor(private databaseService: DatabaseService, updates: SwUpdate, matSnackBar: MatSnackBar) {
    this.updatesSub = merge(this.testSnackbar,
      updates.versionUpdates.pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
    ).pipe(switchMap(() => {
      const ref = matSnackBar.openFromComponent(UpdateAvailableComponent);
      return ref.afterDismissed();
    }))
    .subscribe(x => {
      if (x.dismissedByAction)
        location.reload();
    });
  }

  ngOnDestroy(): void {
    if (this.updatesSub) {
      this.updatesSub.unsubscribe();
      this.updatesSub = null;
    }
  }
}
