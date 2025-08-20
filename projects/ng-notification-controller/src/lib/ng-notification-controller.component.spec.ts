import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CdsLangPipe, CdsLangService } from '@cds/ng-core/lang';
import { CdsIonSwitchModule } from '@cds/ng-ionic-components';
import {
  CdsBottomSheetRef,
  CdsBottomSheetService,
} from '@cds/ng-ionic-components/bottom-sheet';
import { of } from 'rxjs';
import { NgNotificationControllerComponent } from './ng-notification-controller.component';

const mockCdsBottomSheetService = {
  open() {
    return { instance: { isProceed: of(true) }, dismiss: () => {} };
  },
};

const mockCdsLangService = {
  addLangEntriesByUrl(path: string) {
    return of({});
  },
  translate: () => {},
  currentLanguageObservable: of('en'),
};

describe('NgNotificationControllerComponent', () => {
  let component: NgNotificationControllerComponent;
  let fixture: ComponentFixture<NgNotificationControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CommonModule,
        CdsIonSwitchModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      providers: [
        { provide: CdsBottomSheetService, useValue: mockCdsBottomSheetService },
        { provide: CdsLangService, useValue: mockCdsLangService },
        CdsLangPipe,
      ],
      declarations: [NgNotificationControllerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgNotificationControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call checkNotiStatus', () => {
    spyOn(component, 'getNotificationsStatus').and.returnValue(
      of({ enabled: false })
    );
    component['pushnotificationsControl'].setValue(true);
    component['checkNotiStatus']();
  });

  it('should call initNotiSwitch case initNotiSwitchInit is true', () => {
    component['initNotiSwitchInit'] = true;
    component['initNotiSwitch']();
  });

  it('should call initNotiSwitch case initNotiSwitchInit is false', () => {
    component['pushnotificationsControl'].setValue(true);
    component['initNotiSwitch']();
  });

  it('should call initNotiSwitch case ignorePushNotiChange is true enable is true', () => {
    spyOn(component, 'getNotificationsStatus').and.returnValue(
      of({ enabled: false })
    );
    component['ignorePushNotiChange'] = false;
    component['initNotiSwitch']();
    component['pushnotificationsControl'].setValue(true);
  });

  it('should call initNotiSwitch case ignorePushNotiChange is true enable is false', () => {
    spyOn(component, 'getNotificationsStatus').and.returnValue(
      of({ enabled: false })
    );
    component['ignorePushNotiChange'] = false;
    component['initNotiSwitch']();
    component['pushnotificationsControl'].setValue(false);
  });

  it('should call closeSheet', () => {
    const mockData = { dismiss: () => {} } as CdsBottomSheetRef;
    component.closeSheet(mockData);
  });
});
