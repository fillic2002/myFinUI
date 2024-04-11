import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAnalyisComponent } from './asset-analyis.component';

describe('AssetAnalyisComponent', () => {
  let component: AssetAnalyisComponent;
  let fixture: ComponentFixture<AssetAnalyisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetAnalyisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetAnalyisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
