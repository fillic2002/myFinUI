import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonYrComponent } from './common-yr.component';

describe('CommonYrComponent', () => {
  let component: CommonYrComponent;
  let fixture: ComponentFixture<CommonYrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonYrComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonYrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
