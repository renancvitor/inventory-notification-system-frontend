

```plaintext
src/app/
 ├── core/
 │    ├── auth/
 │    │    ├── auth.guard.spec.ts
 │    │    ├── auth.guard.ts
 │    │    ├── auth.model.ts
 │    │    ├── auth.service.spec.ts
 │    │    └── auth.service.ts
 │    ├── errors/
 │    │    ├── api-error.model.ts
 │    │    ├── error.interceptor.ts
 │    │    └── error.service.ts
 │    └── http/
 │         ├── credentials.interceptor.spec.ts
 │         └── credentials.interceptor.ts
 ├── features/
 │    ├── auth/
 │    │    └── login/
 │    │         ├── login.component.html
 │    │         ├── login.component.scss
 │    │         ├── login.component.spec.ts
 │    │         └── login.component.ts
 │    ├── home/
 │    │    ├── home.component.html
 │    │    ├── home.component.scss
 │    │    ├── home.component.spec.ts
 │    │    └── home.component.ts
 │    ├── person/
 │    │    ├── components/
 │    │    │    └── form/
 │    │    │         ├── person-form.component.html
 │    │    │         ├── person-form.component.scss
 │    │    │         ├── person-form.component.spec.ts
 │    │    │         └── person-form.component.ts
 │    │    ├── pages/
 │    │    │    ├── create/
 │    │    │    │    ├── person-create.component.html
 │    │    │    │    ├── person-create.component.scss
 │    │    │    │    ├── person-create.component.spec.ts
 │    │    │    │    └── person-create.component.ts
 │    │    │    ├── edit/
 │    │    │    │    ├── person-edit.component.html
 │    │    │    │    ├── person-edit.component.scss
 │    │    │    │    ├── person-edit.component.spec.ts
 │    │    │    │    └── person-edit.component.ts
 │    │    │    └── list/
 │    │    │         ├── person-list.component.html
 │    │    │         ├── person-list.component.scss
 │    │    │         ├── person-list.component.spec.ts
 │    │    │         └── person-list.component.ts
 │    │    ├── person.service.spec.ts
 │    │    └── person.service.ts
 │    └── user/
 │         ├── user.service.spec.ts
 │         └── user.service.ts
 ├── shared/
 │    ├── components/
 │    │    ├── button/
 │    │    │    ├── button.component.html
 │    │    │    ├── button.component.scss
 │    │    │    ├── button.component.spec.ts
 │    │    │    └── button.component.ts
 │    │    ├── error-snackbar/
 │    │    │    ├── error-snackbar.component.html
 │    │    │    ├── error-snackbar.component.scss
 │    │    │    ├── error-snackbar.component.spec.ts
 │    │    │    └── error-snackbar.component.ts
 │    │    ├── filter-panel/
 │    │    │    ├── filter-panel.component.html
 │    │    │    ├── filter-panel.component.scss
 │    │    │    ├── filter-panel.component.spec.ts
 │    │    │    └── filter-panel.component.ts
 │    │    ├── search-field/
 │    │    │    ├── search-field.component.html
 │    │    │    ├── search-field.component.scss
 │    │    │    ├── search-field.component.spec.ts
 │    │    │    └── search-field.component.ts
 │    │    └── toast/
 │    │         ├── toast.component.html
 │    │         ├── toast.component.scss
 │    │         ├── toast.component.spec.ts
 │    │         └── toast.component.ts
 │    ├── layout/
 │    │    ├── footer/
 │    │    │    ├── footer.component.html
 │    │    │    ├── footer.component.scss
 │    │    │    ├── footer.component.spec.ts
 │    │    │    └── footer.component.ts
 │    │    └── header/
 │    │         ├── header.component.html
 │    │         ├── header.component.scss
 │    │         ├── header.component.spec.ts
 │    │         └── header.component.ts
 │    └── paginator-intl.ts
 ├── app.component.html
 ├── app.component.scss
 ├── app.component.spec.ts
 ├── app.component.ts
 ├── app.config.ts
 ├── app.routes.ts
 └── environments/
      ├── environment.prod.ts
      └── environment.ts
```