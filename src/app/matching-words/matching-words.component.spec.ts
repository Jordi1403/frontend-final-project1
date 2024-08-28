import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingWordsComponent } from './matching-words.component';

describe('MatchingWordsComponent', () => {
  let component: MatchingWordsComponent;
  let fixture: ComponentFixture<MatchingWordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchingWordsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatchingWordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
