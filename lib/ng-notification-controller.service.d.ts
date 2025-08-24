import { CdsLangService } from '@cds/ng-core/lang';
import { Platform } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { NotiConfigurations } from './config/configurations';
import { NotiApi } from './config/noti-api';
import { HttpProvider } from './http-service/http.provider.service';
import * as i0 from "@angular/core";
export declare class NotificationsService {
    private platform;
    private http;
    private cdsLang;
    private host;
    private _notificationSubData;
    private _loadLocalizationSub;
    private PERMISSION_REQUESTED_STATUS;
    private onInitCompleted;
    private onLoadingLocalization;
    private config;
    private needLoadLocalization;
    constructor(platform: Platform, http: HttpProvider, cdsLang: CdsLangService);
    getNotificationSubData(): Subject<any>;
    setupPushNotifications(oneSignalAppId: string, host: NotiApi, config: NotiConfigurations, needLoadLocalization?: boolean): Subject<any>;
    private checkToRequestPermissions;
    private onNotificationsClick;
    private handleOnNotificationsClick;
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
    private parseDeeplink;
    private foregroundWillDisplay;
    private handleOnForegroundWillDisplay;
    private isValidLandingPage;
    private getOnSignalSubscritionId;
    setNotificationsData(data: any): void;
    getNotificationsData(): Promise<any>;
    registerNotifications(mcfId: string, lang: string, apiCredentials?: any, updateLanguageOnly?: boolean): Observable<any>;
    private getHealthApiUrl;
    private setPermissionRequestedStatus;
    private getPermissionRequestedStatus;
    loadLocalizationSub(): Subject<boolean>;
    loadLocalization(): void;
    private loadLocalizationFromRemote;
    private loadLocalizationFromAssest;
    saveNotificationStatus(status: boolean): void;
    getSavedNotificationStatus(): Promise<boolean | undefined>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NotificationsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<NotificationsService>;
}
