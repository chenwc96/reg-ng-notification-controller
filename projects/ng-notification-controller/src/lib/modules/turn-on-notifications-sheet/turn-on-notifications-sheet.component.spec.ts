import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnOnNotificationsSheet } from './turn-on-notifications-sheet.component';
import { CdsBottomSheetRef } from '@cds/ng-ionic-components/bottom-sheet';
import { CdsButtonModule } from '@cds/ng-web-components/button';
import { MLCaptionModule } from '../caption/caption.module';

describe('TurnOnNotificationsSheet', () => {
  let component: TurnOnNotificationsSheet;
  let fixture: ComponentFixture<TurnOnNotificationsSheet>;
  const mockCdsBottomSheetRef = {
    dismiss(){}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MLCaptionModule, CdsButtonModule],
      providers: [
        { provide: CdsBottomSheetRef, useValue: mockCdsBottomSheetRef }
      ],
      declarations: [TurnOnNotificationsSheet]
    }).compileComponents();

    fixture = TestBed.createComponent(TurnOnNotificationsSheet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should cancel', () => {
    component.cancel();
    expect(component).toBeTruthy();
  });

  it('should proceed', () => {
    component.proceed();
    expect(component).toBeTruthy();
  });

});
