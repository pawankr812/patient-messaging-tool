import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectDashboardComponent } from './select-dashboard.component';

describe('SelectDashboardComponent', () => {
  let component: SelectDashboardComponent;
  let fixture: ComponentFixture<SelectDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
