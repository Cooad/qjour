import { ChangeDetectionStrategy, Component, computed, input, output } from "@angular/core";
import { HappenedDocument } from "../../database/models/happened";
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

    delete = output();

    edit = output();
} 