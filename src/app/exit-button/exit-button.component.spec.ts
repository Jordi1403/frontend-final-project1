import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitButtonComponent } from './exit-button.component';

describe('ExitButtonComponent', () => {
  let component: ExitButtonComponent;
  let fixture: ComponentFixture<ExitButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExitButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExitButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
