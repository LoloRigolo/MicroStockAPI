import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandesDetailComponent } from './commandes-detail.component';

describe('CommandesDetailComponent', () => {
  let component: CommandesDetailComponent;
  let fixture: ComponentFixture<CommandesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandesDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommandesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
