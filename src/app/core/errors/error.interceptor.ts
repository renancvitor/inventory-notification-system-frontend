import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { ErrorService } from "./error.service";
import { ApiError } from "./api-error.model";
import { catchError, throwError } from "rxjs";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

    const errorService = inject(ErrorService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {

            const isSessionCheckRequest = req.url.includes('/auth/me');
            const isExpectedUnauthenticated = isSessionCheckRequest && error.status === 401;

            const isLoginRequest = req.url.includes('/login');
            const isExpectedLoginFailure = isLoginRequest && error.status === 401;

            if (isExpectedUnauthenticated || isExpectedLoginFailure) {
                return throwError(() => error);
            }

            const apiError = error.error as ApiError;

            const message = 
                apiError?.message ??
                'Ocorreu um erro desconhecido. Por favor, tente novamente mais tarde.';

            errorService.showError(message);

            return throwError(() => error);
        })
    );
}