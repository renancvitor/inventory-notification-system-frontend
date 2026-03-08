import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { ErrorService } from "./error.service";
import { ApiError } from "./api-error.model";
import { catchError, EMPTY } from "rxjs";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

    const errorService = inject(ErrorService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {

            const apiError = error.error as ApiError;

            const message = 
                apiError?.message ??
                'Ocorreu um erro desconhecido. Por favor, tente novamente mais tarde.';

            errorService.showError(message);

            return EMPTY;
        })
    );
}