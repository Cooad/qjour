import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { BlockType, DatabaseService } from './services/database.service';
import { from, merge } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import * as uuid from 'uuid';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatCardModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {

  databaseService = inject(DatabaseService);
  items$ = from(this.databaseService.blocks).pipe(
    switchMap(blocks => blocks.find().sort({created: 'desc'}).$)
  );

  items = toSignal(this.items$, { initialValue: [] });

  private titleCount = 0;

  async addBlock() {
    const newBlock: BlockType = {
      id: uuid.v4(),
      title: `Title${++this.titleCount}`,
      text: `${this.titleCount}`,
      created: new Date().getTime()
    };
    const blocks = await this.databaseService.blocks;
    blocks.insert(newBlock);
  }

  async startReplication(){
    const repilcationState = await this.databaseService.startRepication();
    merge(
      repilcationState.received$.pipe(map(evt => ({type: 'received',evt}))),
      repilcationState.sent$.pipe(map(evt => ({type: 'sent',evt}))),
      repilcationState.error$.pipe(map(evt => ({type: 'error',evt}))),
      repilcationState.canceled$.pipe(map(evt => ({type: 'canceled',evt}))),
      repilcationState.active$.pipe(map(evt => ({type: 'active',evt})))
    ).subscribe(console.log);
  }
}
