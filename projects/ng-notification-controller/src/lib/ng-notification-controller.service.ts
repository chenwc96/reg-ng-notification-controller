import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { CdsLangService } from '@cds/ng-core/lang';
import { Platform } from '@ionic/angular';
import {
  Observable,
  Subject,
  catchError,
  first,
  from,
  map,
  of,
  switchMap,
  take,
} from 'rxjs';
import { NotiConfigurations } from './config/configurations';
import { NotiApi } from './config/noti-api';
import { NotiSessionStorageKeys } from './const/session-storage-keys';
import { HttpProvider } from './http-service/http.provider.service';
import { NotificationEvent } from './const/notifications-const';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private host: NotiApi;
  private _notificationSubData: Subject<any>;
  private _loadLocalizationSub: Subject<boolean> = null;
  private PERMISSION_REQUESTED_STATUS = 'notification_permission_requested';
  private onInitCompleted = false;
  private onLoadingLocalization = false;
  private config: NotiConfigurations;
  private needLoadLocalization = false;

  constructor(
    private platform: Platform,
    private http: HttpProvider,
    private cdsLang: CdsLangService
  ) {
    this.handleOnNotificationsClick();
    this.handleOnForegroundWillDisplay();
  }

  public getNotificationSubData(): Subject<any> {
    return this._notificationSubData;
  }

  setupPushNotifications(
    oneSignalAppId: string = '',
    host: NotiApi,
    config: NotiConfigurations,
    needLoadLocalization: boolean = false
  ): Subject<any> {
    this._notificationSubData = new Subject();
    this.host = host;
    this.config = config;
    this.needLoadLocalization = needLoadLocalization;
    if (Capacitor.isNativePlatform()) {
      this.platform.ready().then(() => {
        console.log(
          '==>setupPushNotification-oneSignalAppID:>> ' + oneSignalAppId
        );
        if (!oneSignalAppId) {
          console.log('==>setupPushNotification failed-invalid appId');
          return;
        }

        (window as any).plugins.OneSignal.Notifications.addEventListener(
          'click',
          this.onNotificationsClick
        );
        (window as any).plugins.OneSignal.Notifications.addEventListener(
          'foregroundWillDisplay',
          this.foregroundWillDisplay
        );
        (window as any).plugins.OneSignal.initialize(oneSignalAppId);

        // Prompts the user for notification permissions.
        // Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 7) to better communicate to your users what notifications they will get.
        this.checkToRequestPermissions();
        this.loadLocalizationSub().subscribe((status) => {
          console.log('==>noti service load lz success :>> ', status);
        });
        this.loadLocalization();
      });
    }
    return this._notificationSubData;
  }

  private checkToRequestPermissions() {
    this.getPermissionRequestedStatus().then((status) => {
      if (status) {
        console.log('==>checkToRequestPermissions- requested already');
        return;
      }
      (window as any).plugins.OneSignal.Notifications.requestPermission(
        true
      ).then((accepted: boolean) => {
        if (accepted) {
          this.setPermissionRequestedStatus(true);
        }
      });
    });
  }

  private onNotificationsClick(data: any) {
    const customEvent = new CustomEvent('handleOnNotificationsClick', {
      detail: {
        data: data,
      },
    });
    // dispatch event to resolve OneSignal's listener scode issues.
    window.dispatchEvent(customEvent);
  }

  private handleOnNotificationsClick() {
    window.addEventListener('handleOnNotificationsClick', (event: any) => {
      var data = event.detail.data;
      const additionaldata = data?.notification?.additionalData;
      console.log('==>handleOnNotificationsClick:>> ', JSON.stringify(data));
      const deepLinkData = this.parseDeeplink(additionaldata);
      this._notificationSubData.next(deepLinkData);
    });
  }

  /**
   * @returns data = {
      pushNotificationId: '123',
      eventType: notificationWillDisplayEvent or notificationClickEvent
      deepLinkType: 'app',
      landingPage: {
        vi: 'portfolio',
        en: 'portfolio'
      },
      mode: 'in-app'
    };
   */
  private parseDeeplink(additionaldata: any): any {
    const landingPage = additionaldata?.landingPage;
    if (landingPage && this.isValidLandingPage(landingPage)) {
      const data = {
        eventType: NotificationEvent.notificationClick,
        pushNotificationId: additionaldata?.pushNotificationId,
        deepLinkType: 'app',
        landingPage: {
          en: landingPage,
        },
        mode: 'in-app',
      };
      return data;
    } else if (additionaldata?.externalLink) {
      try {
        const externalLink = JSON.parse(additionaldata?.externalLink);
        const data = {
          eventType: NotificationEvent.notificationClick,
          pushNotificationId: additionaldata?.pushNotificationId,
          deepLinkType: 'website',
          landingPage: externalLink?.urls,
          mode: externalLink?.mode,
        };
        return data;
      } catch (error) {
        console.log('==>parseDeeplink - parse data error :>> ', error);
      }
    } else {
      const data = {
        eventType: NotificationEvent.notificationClick,
        pushNotificationId: additionaldata?.pushNotificationId,
        landingPage: null,
      };
      return data;
    }
  }

  private foregroundWillDisplay(data: any) {
    const customEvent = new CustomEvent('handleOnForegroundWillDisplay', {
      detail: {
        data: data,
      },
    });
    // dispatch event to resolve OneSignal's listener scode issues.
    window.dispatchEvent(customEvent);
  }

  private handleOnForegroundWillDisplay() {
    window.addEventListener('handleOnForegroundWillDisplay', (event: any) => {
      const eventData = {
        eventType: NotificationEvent.notificationWillDisplay,
        data: event?.detail?.data,
      };
      this._notificationSubData.next(eventData);
    });
  }

  private isValidLandingPage(landingPage: string): boolean {
    // TODO: implement logic to validate url
    if (landingPage) {
      return true;
    } else {
      return false;
    }
  }

  private getOnSignalSubscritionId(): Observable<any> {
    if (!Capacitor.isNativePlatform()) {
      return of('');
    }
    try {
      return from(
        (window as any).plugins.OneSignal.User.pushSubscription.getIdAsync()
      );
    } catch (error) {
      return of('');
    }
  }

  public setNotificationsData(data: any) {
    const value = JSON.stringify(data);
    Preferences.set({
      key: NotiSessionStorageKeys.NOTIFICATIONS_DATA,
      value: value,
    });
  }

  public async getNotificationsData(): Promise<any> {
    return (
      await Preferences.get({ key: NotiSessionStorageKeys.NOTIFICATIONS_DATA })
    )?.value;
  }

  registerNotifications(
    mcfId: string,
    lang: string,
    apiCredentials: any = {},
    updateLanguageOnly: boolean = false
  ): Observable<any> {
    if (!mcfId) {
      console.log('==>registerNotifications failed-invalid data');
      return of(null);
    }
    return this.getOnSignalSubscritionId().pipe(
      switchMap((subId) => {
        if (Capacitor.isNativePlatform() && !subId) {
          return of(null);
        }
        const data = {
          deviceId: subId,
          language: lang,
          mcfId: mcfId,
          updateLanguageOnly: updateLanguageOnly,
        };
        const url = this.getHealthApiUrl(this.host);
        return this.http.post(url, data, { headers: apiCredentials }).pipe(
          take(1),
          map((response: any) => response),
          catchError((err) => {
            console.log(
              '==>registerNotifications error :>> ' + JSON.stringify(err)
            );
            return of(null);
          })
        );
      })
    );
  }

  private getHealthApiUrl(host: NotiApi) {
    return `${host.uri}/${host.version}/${host.endpoint}`;
  }

  private setPermissionRequestedStatus(status: boolean) {
    Preferences.set({
      key: NotiSessionStorageKeys.KEY_ONE_SIGNAL_REGISTERED,
      value: status ? this.PERMISSION_REQUESTED_STATUS : '',
    });
  }

  private async getPermissionRequestedStatus(): Promise<boolean> {
    return (
      (
        await Preferences.get({
          key: NotiSessionStorageKeys.KEY_ONE_SIGNAL_REGISTERED,
        })
      )?.value === this.PERMISSION_REQUESTED_STATUS
    );
  }

  loadLocalizationSub(): Subject<boolean> {
    if (this._loadLocalizationSub === null) {
      this._loadLocalizationSub = new Subject();
    }
    return this._loadLocalizationSub;
  }

  loadLocalization() {
    if (!this.needLoadLocalization) {
      this.onInitCompleted = true;
      this._loadLocalizationSub.next(true);
      return;
    }
    if (!this.onLoadingLocalization) {
      this.onLoadingLocalization = true;
      this.loadLocalizationFromRemote().subscribe((status) => {
        console.log('==>loadLocalization-status :>> ', status);
        this.onLoadingLocalization = false;
        this.onInitCompleted = !!status;
        this._loadLocalizationSub.next(!!status);
      });
    }
  }

  private loadLocalizationFromRemote(): Observable<boolean> {
    if (!this.config || !this.config.localizeConfigPath) {
      return of(false);
    }
    if (!this.onInitCompleted) {
      return this.cdsLang
        .addLangEntriesByUrl(this.config.localizeConfigPath)
        .pipe(
          first(),
          map((data) => !!data),
          catchError((err) => {
            console.log(
              '==>loadLocalizationFromRemote from remote-error: ',
              JSON.stringify(err)
            );
            return this.loadLocalizationFromAssest();
          })
        );
    } else {
      return of(true);
    }
  }

  private loadLocalizationFromAssest(): Observable<any> {
    const localizeConfigPath = 'assets/localizations/notifications.json';
    return this.cdsLang.addLangEntriesByUrl(localizeConfigPath).pipe(
      first(),
      map((data) => !!data),
      catchError((err) => {
        console.log(
          '==>loadLocalizationFromAssest-error: ',
          JSON.stringify(err)
        );
        return of(false);
      })
    );
  }

  saveNotificationStatus(status: boolean) {
    Preferences.set({
      key: NotiSessionStorageKeys.KEY_NOTIFICATION_STATUS,
      value: status ? 'on' : 'off',
    });
  }

  async getSavedNotificationStatus(): Promise<boolean | undefined> {
    const data = await Preferences.get({
      key: NotiSessionStorageKeys.KEY_NOTIFICATION_STATUS,
    });
    if (!data || !data?.value) {
      return undefined;
    }
    return data?.value === 'on';
  }
}
