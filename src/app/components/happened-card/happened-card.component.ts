import { ChangeDetectionStrategy, Component, input, output } from "@angular/core";
import { Happened, HappenedDocument } from "../../database/models/happened";
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HappenedSimple, isSimpleType } from "../../database/models/happened-template";

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

    hasNote(happened: Happened) {
        if (!isSimpleType(happened))
            return false;
        return !!(happened.metadata.note);
    }

    getNote(happened: Happened) {
        if (!isSimpleType(happened))
            return "";
        return happened.metadata.note;
    }
} 