import { ChangeDetectionStrategy, Component, Injector, OnInit, effect, inject, input, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from "@angular/material/icon";
import { HappenedTemplate, HappenedTypes } from "../../database/models/happened-template";

@Component({
    templateUrl: './template-edit.component.html',
    selector: 'app-template-edit',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        MatIconModule,
        FormsModule
    ],
    standalone: true
})
export class TemplateEditComponent implements OnInit {
    template = input.required<HappenedTemplate>();
    templateChange = output<HappenedTemplate>();

    private injector = inject(Injector);

    ngOnInit(): void {
        const template = this.template();
        this.title.set(template.title);
        this.type.set(template.type);
        this.metadata.set(template.metadata);
        effect(() => {
            this.templateChange.emit({
                ...template,
                title: this.title(),
                type: this.type(),
                metadata: this.metadata()
            });
        }, { injector: this.injector });
    }

    title = signal<string>('');
    type = signal<HappenedTypes>('simple');
    metadata = signal<any>({});

    modifyMetadata(key: string, value: string | number) {
        this.metadata.update(m => ({ ...m, [key]: value }));
    }
}

