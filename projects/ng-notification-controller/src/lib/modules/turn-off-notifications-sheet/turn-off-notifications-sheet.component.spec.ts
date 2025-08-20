import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnOffNotificationsSheet } from './turn-off-notifications-sheet.component';
import { CdsBottomSheetRef } from '@cds/ng-ionic-components/bottom-sheet';
import { MLCaptionModule } from '../caption/caption.module';
import { CdsButtonModule } from '@cds/ng-web-components/button';

const mockCdsBottomSheetRef = {
  dismiss(){}
};

describe('TurnOffNotificationsSheet', () => {
  let component: TurnOffNotificationsSheet;
  let fixture: ComponentFixture<TurnOffNotificationsSheet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MLCaptionModule, CdsButtonModule],
      providers: [
        { provide: CdsBottomSheetRef, useValue: mockCdsBottomSheetRef }
      ],
      declarations: [TurnOffNotificationsSheet]
    }).compileComponents();

    fixture = TestBed.createComponent(TurnOffNotificationsSheet);
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
