import { ChangeDetectionStrategy, Component, computed, input, output } from "@angular/core";
import { HappenedDocument } from "../../models/happened";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { Observable, map, switchMap } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    standalone: true,
    selector: 'app-happened-card',
    templateUrl: './happened-card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatButtonModule, MatIconModule, MatExpansionModule]
})
export class HappenedCardComponent {
    happened = input.required<HappenedDocument>();

    private happenedTypeTitle$: Observable<string> = toObservable(this.happened).pipe(
        switchMap(happened => happened?.populate('type') ?? []),
        map(x => x?.title)
    );

    happenedTypeTitle = toSignal(this.happenedTypeTitle$);

    happenedDate = computed(() => this.happened().happenedAt);

    delete = output();
} 