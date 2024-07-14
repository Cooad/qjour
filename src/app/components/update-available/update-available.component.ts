import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarAction, MatSnackBarActions, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  template: `
    <span matSnackBarLabel>Update available</span>
    <span matSnackBarActions>
      <button mat-button matSnackBarAction (click)="snackBarRef.dismiss()">Dismiss</button>
      <button mat-button matSnackBarAction (click)="snackBarRef.dismissWithAction()">Reload</button>
    </span>
  `,
  imports: [MatButtonModule, MatSnackBarLabel, MatSnackBarActions, MatSnackBarAction],
  styles:`
    :host {
      display:flex
    }
  `
})
export class UpdateAvailableComponent {
  snackBarRef = inject(MatSnackBarRef);
}