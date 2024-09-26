import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationAttackTimeComponent } from './translation-attack-time.component';

describe('TranslationAttackTimeComponent', () => {
  let component: TranslationAttackTimeComponent;
  let fixture: ComponentFixture<TranslationAttackTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslationAttackTimeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TranslationAttackTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
