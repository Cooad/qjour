import { ChangeDetectionStrategy, Component, computed, input } from "@angular/core";
import { HappenedDocument } from "../../models/happened";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { CommonModule } from "@angular/common";
import { Observable, from, map, switchMap, tap } from "rxjs";

@Component({
    standalone: true,
    selector: 'app-happened-card',
    templateUrl: './happened-card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule]
})
export class HappenedCardComponent {
    happened = input.required<HappenedDocument>();

    private happenedTypeTitle$: Observable<string> = toObservable(this.happened).pipe(
        switchMap(happened => happened?.populate('type') ?? []),
        map(x => x?.title)
    );

    happenedTypeTitle = toSignal(this.happenedTypeTitle$);

    happenedDate = computed(() => this.happened().happenedAt);
} 