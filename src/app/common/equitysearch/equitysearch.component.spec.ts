import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquitysearchComponent } from './equitysearch.component';

describe('EquitysearchComponent', () => {
  let component: EquitysearchComponent;
  let fixture: ComponentFixture<EquitysearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EquitysearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EquitysearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
