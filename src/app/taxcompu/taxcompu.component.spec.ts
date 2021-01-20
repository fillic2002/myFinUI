import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxcompuComponent } from './taxcompu.component';

describe('TaxcompuComponent', () => {
  let component: TaxcompuComponent;
  let fixture: ComponentFixture<TaxcompuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaxcompuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxcompuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
