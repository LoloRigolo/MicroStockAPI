import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMagasinComponent } from './dashboard-magasin.component';

describe('DashboardMagasinComponent', () => {
  let component: DashboardMagasinComponent;
  let fixture: ComponentFixture<DashboardMagasinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardMagasinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMagasinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
