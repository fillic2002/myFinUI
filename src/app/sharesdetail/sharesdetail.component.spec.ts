import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharesdetailComponent } from './sharesdetail.component';

describe('SharesdetailComponent', () => {
  let component: SharesdetailComponent;
  let fixture: ComponentFixture<SharesdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharesdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharesdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
