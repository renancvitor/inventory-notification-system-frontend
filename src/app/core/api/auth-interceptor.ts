import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const closed = req.clone({
    withCredentials: true,
  });
  
  return next(closed);
};
