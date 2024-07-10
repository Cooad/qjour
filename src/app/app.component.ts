import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { BlockType, DatabaseService } from './services/database.service';
import { Subscription, merge } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import * as uuid from 'uuid';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCardModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy {

  itemsQuery = this.databaseService.db.blocks.find().sort({ created: 'desc' });
  items = toSignal(this.itemsQuery.$, { initialValue: [] });

  replicationSub: Subscription | null;
  updatesSub: Subscription | null;

  constructor(private databaseService: DatabaseService, updates: SwUpdate) {
    this.replicationSub = !this.databaseService.replicationState
      ? null
      : merge(
        this.databaseService.replicationState.received$.pipe(map(evt => ({ type: 'received', evt }))),
        this.databaseService.replicationState.sent$.pipe(map(evt => ({ type: 'sent', evt }))),
        this.databaseService.replicationState.error$.pipe(map(evt => ({ type: 'error', evt }))),
        this.databaseService.replicationState.canceled$.pipe(map(evt => ({ type: 'canceled', evt }))),
        this.databaseService.replicationState.active$.pipe(map(evt => ({ type: 'active', evt })))
      ).subscribe(console.log)
    this.updatesSub = updates.versionUpdates.pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(() => console.log('new version available'));
  }

  private titleCount = 0;

  async addBlock() {
    const newBlock: BlockType = {
      id: uuid.v4(),
      title: `Title${++this.titleCount}`,
      text: `${this.titleCount}`,
      created: new Date().getTime()
    };
    await this.databaseService.db.blocks.insert(newBlock);
  }

  ngOnDestroy(): void {
    if (!this.replicationSub) return;
    this.replicationSub.unsubscribe();
    this.replicationSub = null;
  }
}
