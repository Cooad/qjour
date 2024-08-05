import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { merge, of, Subscription } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { UpdateAvailableComponent } from './components/update-available/update-available.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatListModule, RouterOutlet, RouterLink, MatSidenavModule, MatToolbarModule],
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy {

  private updatesSub: Subscription | null;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;


  constructor(updates: SwUpdate, matSnackBar: MatSnackBar, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
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

  ngOnDestroy(): void {
    if (this.updatesSub) {
      this.updatesSub.unsubscribe();
      this.updatesSub = null;
    }
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
