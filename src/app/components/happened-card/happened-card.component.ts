import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { HappenedDocument } from "../../database/models/happened";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

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