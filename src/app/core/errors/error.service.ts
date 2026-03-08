import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ErrorSnackbarComponent } from "../../shared/components/error-snackbar/error-snackbar.component";

@Injectable({
    providedIn: 'root'
})
export class ErrorService {

    constructor(private snackBar: MatSnackBar) {}

    showError(message: string) {
        const ref = this.snackBar.openFromComponent(ErrorSnackbarComponent, {
            data: { message },
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
        });

        ref.afterDismissed().subscribe(() => {
            window.location.reload();
        });
    }
}