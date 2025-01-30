import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelaysCreateComponent } from './relays-create.component';

describe('RelaysCreateComponent', () => {
  let component: RelaysCreateComponent;
  let fixture: ComponentFixture<RelaysCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelaysCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelaysCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
