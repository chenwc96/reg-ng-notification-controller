import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Capacitor } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { NotiConfigurations } from 'ng-notification-controller';
import OneSignal from 'onesignal-cordova-plugin';
import { Subject, defer, of } from 'rxjs';
import { NotiApi } from './config/noti-api';
import { NotificationsService } from './ng-notification-controller.service';
import { CdsLangService } from '@cds/ng-core/lang';

export function asyncError<T>(errorObject: any) {
  return defer(() => Promise.reject(errorObject));
}

describe('NotificationsService', () => {
  let service: NotificationsService;
  let httpTestingController: HttpTestingController;
  let platform: Platform;
  let httpProviderSpy: { post: jasmine.Spy };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [],
    });
    service = TestBed.inject(NotificationsService);
    service['_notificationSubData'] = new Subject<any>();
    service['_loadLocalizationSub'] = new Subject<boolean>();
    platform = TestBed.inject(Platform);
    httpProviderSpy = jasmine.createSpyObj('HttpProvider', ['post']);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should getNotificationSubData', () => {
    let spy = spyOn(service, 'getNotificationSubData').and.callThrough();
    service.getNotificationSubData();
    expect(spy).toHaveBeenCalled();
  });

  it('should call setupPushNotification fail', () => {
    let spy = spyOn(service, 'setupPushNotifications').and.callThrough();
    let notifiApi: NotiApi;
    let config: NotiConfigurations;
    spyOn(Capacitor, 'isNativePlatform').and.returnValue(false);
    service.setupPushNotifications('Unittest', notifiApi, config);
    expect(spy).toHaveBeenCalled();
  });

  it('should call setupPushNotification null', () => {
    let spy = spyOn(service, 'setupPushNotifications').and.callThrough();
    let notifiApi: NotiApi;
    let config: NotiConfigurations;
    spyOn(Capacitor, 'isNativePlatform').and.returnValue(true);
    service.setupPushNotifications(null, notifiApi, config);
    expect(service).toBeTruthy();
  });

  it('should call setupPushNotification success', async () => {
    let notifiApi: NotiApi;
    spyOn(Capacitor, 'isNativePlatform').and.returnValue(true);
    // service['oneSignalId'] = null;
    spyOn(OneSignal.Notifications, 'addEventListener').and.returnValue();
    spyOn(OneSignal, 'initialize').and.returnValue();
    // spyOn(OneSignal.Notifications,'requestPermission').and.returnValue();
    let config: NotiConfigurations;
    service.setupPushNotifications('unit test', notifiApi, config);
    expect(service).toBeTruthy();
  });

  it('should call ', () => {
    service.getNotificationSubData();
    expect(service).toBeTruthy();
  });

  it('should call on notifications Click', () => {
    var tempData = {
      detail: {
        data: {
          data1: '123',
          notification: {
            temp: '123',
            additionalData: {
              landingPage: 'unit test 123',
            },
          },
        },
      },
      notification: {
        temp: '123',
        additionalData: {
          landingPage: 'unit test 123',
        },
      },
    };
    service['onNotificationsClick'](tempData);
    expect(service).toBeTruthy();
  });

  it('Should call parse deep link with null data', () => {
    service['parseDeeplink']({});
  });

  it('Should call parse deep link and run into catch', () => {
    service['parseDeeplink']({ externalLink: 'unit test' });
  });

  it('Should call parse deep link with landing page', () => {
    service['parseDeeplink']({
      externalLink: 'unit test',
      landingPage: 'unit test',
    });
  });

  it('Should call parse deep link external Link', () => {
    service['parseDeeplink']({
      externalLink: 'unit test',
      landingPage: 'unit test',
    });
  });

  it('Should call isValidLandingPage with null', () => {
    service['isValidLandingPage'](null);
  });

  it('Should call isValidLandingPage with data', () => {
    service['isValidLandingPage']('unit test');
  });

  it('Should call setNotificationsData', () => {
    const data = {};
    service.setNotificationsData(data);
  });

  it('Should call getNotificationsData', () => {
    spyOn<any>(service, 'getNotificationsData').and.callThrough();
    service['getNotificationsData']();
  });

  it('Should call registerNotifications with oneSignalSubId null', () => {
    service['oneSignalSubId'] = null;
    service.registerNotifications(null, 'vi', '');
  });

  it('Should call registerNotifications with mfcId null', () => {
    service['oneSignalSubId'] = 'sdfdfd';
    service.registerNotifications(null, 'vi', '');
  });

  it('Should call registerNotifications success', () => {
    service['oneSignalSubId'] = 'unit test';
    const mockRespones = {
      status: 'ok',
    };
    const mockHost: NotiApi = {
      endpoint: 'unittest',
      uri: 'unittest',
      version: 'unittest',
    };
    service['host'] = mockHost;
    let mockResponse = { abc: 1 } as any;
    httpProviderSpy.post.and.returnValue(of(mockResponse));
    service.registerNotifications('sdfdf', 'vi', '');
  });

  it('Should call registerNotifications not found', () => {
    service['oneSignalSubId'] = 'unit test';
    const mockRespones = {
      status: 'ok',
    };
    const mockHost: NotiApi = {
      endpoint: 'unittest',
      uri: 'unittest',
      version: 'unittest',
    };
    service['host'] = mockHost;
    service.registerNotifications('unit test', 'vi', '');
    const postRq = httpTestingController.expectNone(
      'unittest/unittest/unittest'
    );
  });

  it('Should call checkToRequestPermissions firt time', () => {
    spyOn<any>(service, 'checkToRequestPermissions').and.callThrough();
    spyOn<any>(service, 'getPermissionRequestedStatus').and.returnValue(
      Promise.resolve(false)
    );
    service['checkToRequestPermissions']();
  });

  it('Should call checkToRequestPermissions second time', () => {
    spyOn<any>(service, 'checkToRequestPermissions').and.callThrough();
    spyOn<any>(service, 'getPermissionRequestedStatus').and.returnValue(
      Promise.resolve(true)
    );
    service['checkToRequestPermissions']();
  });

  it('should call loadCdsFieldsNotifications', () => {
    service.loadLocalization();
  });

  it('should call loadLocalizationFromAssest', () => {
    spyOn<any>(service, 'loadLocalizationFromAssest').and.returnValue(
      Promise.resolve(false)
    );
    service['loadLocalizationFromAssest']();
  });

  it('Should call getHealthApiUrl', () => {
    spyOn<any>(service, 'getHealthApiUrl').and.callThrough();
    const host: NotiApi = { uri: '', version: 'v1', endpoint: 'test' };
    service['getHealthApiUrl'](host);
  });

  it('Should call setPermissionRequestedStatus', () => {
    spyOn<any>(service, 'setPermissionRequestedStatus').and.callThrough();
    service['setPermissionRequestedStatus'](true);
  });

  it('Should call loadLocalizationFromAssest', () => {
    spyOn<any>(service, 'loadLocalizationFromAssest').and.callThrough();
    service['loadLocalizationFromAssest']();
  });

  it('Should call loadLocalizationFromRemote', () => {
    service['config'] = { localizeConfigPath: 'test' };
    service['onInitCompleted'] = false;
    service['cdsLang'] = TestBed.inject(CdsLangService);
    spyOn<any>(service, 'loadLocalizationFromRemote').and.callThrough();
    service['loadLocalizationFromRemote']();

    service['onInitCompleted'] = true;
    service['loadLocalizationFromRemote']();
  });
});
