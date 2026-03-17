import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonCreateComponent } from '../create/person-create.component';

describe('PersonCreateComponent', () => {
  let component: PersonCreateComponent;
  let fixture: ComponentFixture<PersonCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonCreateComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
