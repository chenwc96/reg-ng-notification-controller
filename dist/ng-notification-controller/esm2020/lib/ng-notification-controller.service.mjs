import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { Subject, catchError, first, from, map, of, switchMap, take, } from 'rxjs';
import { NotiSessionStorageKeys } from './const/session-storage-keys';
import { NotificationEvent } from './const/notifications-const';
import * as i0 from "@angular/core";
import * as i1 from "@ionic/angular";
import * as i2 from "./http-service/http.provider.service";
import * as i3 from "@cds/ng-core/lang";
export class NotificationsService {
    constructor(platform, http, cdsLang) {
        this.platform = platform;
        this.http = http;
        this.cdsLang = cdsLang;
        this._loadLocalizationSub = null;
        this.PERMISSION_REQUESTED_STATUS = 'notification_permission_requested';
        this.onInitCompleted = false;
        this.onLoadingLocalization = false;
        this.needLoadLocalization = false;
        this.handleOnNotificationsClick();
        this.handleOnForegroundWillDisplay();
    }
    getNotificationSubData() {
        return this._notificationSubData;
    }
    setupPushNotifications(oneSignalAppId = '', host, config, needLoadLocalization = false) {
        this._notificationSubData = new Subject();
        this.host = host;
        this.config = config;
        this.needLoadLocalization = needLoadLocalization;
        if (Capacitor.isNativePlatform()) {
            this.platform.ready().then(() => {
                console.log('==>setupPushNotification-oneSignalAppID:>> ' + oneSignalAppId);
                if (!oneSignalAppId) {
                    console.log('==>setupPushNotification failed-invalid appId');
                    return;
                }
                window.plugins.OneSignal.Notifications.addEventListener('click', this.onNotificationsClick);
                window.plugins.OneSignal.Notifications.addEventListener('foregroundWillDisplay', this.foregroundWillDisplay);
                window.plugins.OneSignal.initialize(oneSignalAppId);
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
    checkToRequestPermissions() {
        this.getPermissionRequestedStatus().then((status) => {
            if (status) {
                console.log('==>checkToRequestPermissions- requested already');
                return;
            }
            window.plugins.OneSignal.Notifications.requestPermission(true).then((accepted) => {
                if (accepted) {
                    this.setPermissionRequestedStatus(true);
                }
            });
        });
    }
    onNotificationsClick(data) {
        const customEvent = new CustomEvent('handleOnNotificationsClick', {
            detail: {
                data: data,
            },
        });
        // dispatch event to resolve OneSignal's listener scode issues.
        window.dispatchEvent(customEvent);
    }
    handleOnNotificationsClick() {
        window.addEventListener('handleOnNotificationsClick', (event) => {
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
    parseDeeplink(additionaldata) {
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
        }
        else if (additionaldata?.externalLink) {
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
            }
            catch (error) {
                console.log('==>parseDeeplink - parse data error :>> ', error);
            }
        }
        else {
            const data = {
                eventType: NotificationEvent.notificationClick,
                pushNotificationId: additionaldata?.pushNotificationId,
                landingPage: null,
            };
            return data;
        }
    }
    foregroundWillDisplay(data) {
        const customEvent = new CustomEvent('handleOnForegroundWillDisplay', {
            detail: {
                data: data,
            },
        });
        // dispatch event to resolve OneSignal's listener scode issues.
        window.dispatchEvent(customEvent);
    }
    handleOnForegroundWillDisplay() {
        window.addEventListener('handleOnForegroundWillDisplay', (event) => {
            const eventData = {
                eventType: NotificationEvent.notificationWillDisplay,
                data: event?.detail?.data,
            };
            this._notificationSubData.next(eventData);
        });
    }
    isValidLandingPage(landingPage) {
        // TODO: implement logic to validate url
        if (landingPage) {
            return true;
        }
        else {
            return false;
        }
    }
    getOnSignalSubscritionId() {
        if (!Capacitor.isNativePlatform()) {
            return of('');
        }
        try {
            return from(window.plugins.OneSignal.User.pushSubscription.getIdAsync());
        }
        catch (error) {
            return of('');
        }
    }
    setNotificationsData(data) {
        const value = JSON.stringify(data);
        Preferences.set({
            key: NotiSessionStorageKeys.NOTIFICATIONS_DATA,
            value: value,
        });
    }
    async getNotificationsData() {
        return (await Preferences.get({ key: NotiSessionStorageKeys.NOTIFICATIONS_DATA }))?.value;
    }
    registerNotifications(mcfId, lang, apiCredentials = {}, updateLanguageOnly = false) {
        if (!mcfId) {
            console.log('==>registerNotifications failed-invalid data');
            return of(null);
        }
        return this.getOnSignalSubscritionId().pipe(switchMap((subId) => {
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
            return this.http.post(url, data, { headers: apiCredentials }).pipe(take(1), map((response) => response), catchError((err) => {
                console.log('==>registerNotifications error :>> ' + JSON.stringify(err));
                return of(null);
            }));
        }));
    }
    getHealthApiUrl(host) {
        return `${host.uri}/${host.version}/${host.endpoint}`;
    }
    setPermissionRequestedStatus(status) {
        Preferences.set({
            key: NotiSessionStorageKeys.KEY_ONE_SIGNAL_REGISTERED,
            value: status ? this.PERMISSION_REQUESTED_STATUS : '',
        });
    }
    async getPermissionRequestedStatus() {
        return ((await Preferences.get({
            key: NotiSessionStorageKeys.KEY_ONE_SIGNAL_REGISTERED,
        }))?.value === this.PERMISSION_REQUESTED_STATUS);
    }
    loadLocalizationSub() {
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
    loadLocalizationFromRemote() {
        if (!this.config || !this.config.localizeConfigPath) {
            return of(false);
        }
        if (!this.onInitCompleted) {
            return this.cdsLang
                .addLangEntriesByUrl(this.config.localizeConfigPath)
                .pipe(first(), map((data) => !!data), catchError((err) => {
                console.log('==>loadLocalizationFromRemote from remote-error: ', JSON.stringify(err));
                return this.loadLocalizationFromAssest();
            }));
        }
        else {
            return of(true);
        }
    }
    loadLocalizationFromAssest() {
        const localizeConfigPath = 'assets/localizations/notifications.json';
        return this.cdsLang.addLangEntriesByUrl(localizeConfigPath).pipe(first(), map((data) => !!data), catchError((err) => {
            console.log('==>loadLocalizationFromAssest-error: ', JSON.stringify(err));
            return of(false);
        }));
    }
    saveNotificationStatus(status) {
        Preferences.set({
            key: NotiSessionStorageKeys.KEY_NOTIFICATION_STATUS,
            value: status ? 'on' : 'off',
        });
    }
    async getSavedNotificationStatus() {
        const data = await Preferences.get({
            key: NotiSessionStorageKeys.KEY_NOTIFICATION_STATUS,
        });
        if (!data || !data?.value) {
            return undefined;
        }
        return data?.value === 'on';
    }
}
NotificationsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: NotificationsService, deps: [{ token: i1.Platform }, { token: i2.HttpProvider }, { token: i3.CdsLangService }], target: i0.ɵɵFactoryTarget.Injectable });
NotificationsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: NotificationsService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: NotificationsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1.Platform }, { type: i2.HttpProvider }, { type: i3.CdsLangService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctbm90aWZpY2F0aW9uLWNvbnRyb2xsZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25nLW5vdGlmaWNhdGlvbi1jb250cm9sbGVyL3NyYy9saWIvbmctbm90aWZpY2F0aW9uLWNvbnRyb2xsZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM1QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFHckQsT0FBTyxFQUVMLE9BQU8sRUFDUCxVQUFVLEVBQ1YsS0FBSyxFQUNMLElBQUksRUFDSixHQUFHLEVBQ0gsRUFBRSxFQUNGLFNBQVMsRUFDVCxJQUFJLEdBQ0wsTUFBTSxNQUFNLENBQUM7QUFHZCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUV0RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQzs7Ozs7QUFLaEUsTUFBTSxPQUFPLG9CQUFvQjtJQVUvQixZQUNVLFFBQWtCLEVBQ2xCLElBQWtCLEVBQ2xCLE9BQXVCO1FBRnZCLGFBQVEsR0FBUixRQUFRLENBQVU7UUFDbEIsU0FBSSxHQUFKLElBQUksQ0FBYztRQUNsQixZQUFPLEdBQVAsT0FBTyxDQUFnQjtRQVZ6Qix5QkFBb0IsR0FBcUIsSUFBSSxDQUFDO1FBQzlDLGdDQUEyQixHQUFHLG1DQUFtQyxDQUFDO1FBQ2xFLG9CQUFlLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLDBCQUFxQixHQUFHLEtBQUssQ0FBQztRQUU5Qix5QkFBb0IsR0FBRyxLQUFLLENBQUM7UUFPbkMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7UUFDbEMsSUFBSSxDQUFDLDZCQUE2QixFQUFFLENBQUM7SUFDdkMsQ0FBQztJ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LFdBQVcsQ0FBQyxHQUFHLENBQUM7WUFDZCxHQUFHLEVBQUUsc0JBQXNCLENBQUMsdUJBQXVCO1lBQ25ELEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSztTQUM3QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLDBCQUEwQjtRQUM5QixNQUFNLElBQUksR0FBRyxNQUFNLFdBQVcsQ0FBQyxHQUFHLENBQUM7WUFDakMsR0FBRyxFQUFFLHNCQUFzQixDQUFDLHVCQUF1QjtTQUNwRCxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtZQUN6QixPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUNELE9BQU8sSUFBSSxFQUFFLEtBQUssS0FBSyxJQUFJLENBQUM7SUFDOUIsQ0FBQzs7a0hBcFZVLG9CQUFvQjtzSEFBcEIsb0JBQW9CLGNBRm5CLE1BQU07NEZBRVAsb0JBQW9CO2tCQUhoQyxVQUFVO21CQUFDO29CQUNWLFVBQVUsRUFBRSxNQUFNO2lCQUNuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENhcGFjaXRvciB9IGZyb20gJ0BjYXBhY2l0b3IvY29yZSc7XG5pbXBvcnQgeyBQcmVmZXJlbmNlcyB9IGZyb20gJ0BjYXBhY2l0b3IvcHJlZmVyZW5jZXMnO1xuaW1wb3J0IHsgQ2RzTGFuZ1NlcnZpY2UgfSBmcm9tICdAY2RzL25nLWNvcmUvbGFuZyc7XG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJ0Bpb25pYy9hbmd1bGFyJztcbmltcG9ydCB7XG4gIE9ic2VydmFibGUsXG4gIFN1YmplY3QsXG4gIGNhdGNoRXJyb3IsXG4gIGZpcnN0LFxuICBmcm9tLFxuICBtYXAsXG4gIG9mLFxuICBzd2l0Y2hNYXAsXG4gIHRha2UsXG59IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgTm90aUNvbmZpZ3VyYXRpb25zIH0gZnJvbSAnLi9jb25maWcvY29uZmlndXJhdGlvbnMnO1xuaW1wb3J0IHsgTm90aUFwaSB9IGZyb20gJy4vY29uZmlnL25vdGktYXBpJztcbmltcG9ydCB7IE5vdGlTZXNzaW9uU3RvcmFnZUtleXMgfSBmcm9tICcuL2NvbnN0L3Nlc3Npb24tc3RvcmFnZS1rZXlzJztcbmltcG9ydCB7IEh0dHBQcm92aWRlciB9IGZyb20gJy4vaHR0cC1zZXJ2aWNlL2h0dHAucHJvdmlkZXIuc2VydmljZSc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb25FdmVudCB9IGZyb20gJy4vY29uc3Qvbm90aWZpY2F0aW9ucy1jb25zdCc7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnLFxufSlcbmV4cG9ydCBjbGFzcyBOb3RpZmljYXRpb25zU2VydmljZSB7XG4gIHByaXZhdGUgaG9zdDogTm90aUFwaTtcbiAgcHJpdmF0ZSBfbm90aWZpY2F0aW9uU3ViRGF0YTogU3ViamVjdDxhbnk+O1xuICBwcml2YXRlIF9sb2FkTG9jYWxpemF0aW9uU3ViOiBTdWJqZWN0PGJvb2xlYW4+ID0gbnVsbDtcbiAgcHJpdmF0ZSBQRVJNSVNTSU9OX1JFUVVFU1RFRF9TVEFUVVMgPSAnbm90aWZpY2F0aW9uX3Blcm1pc3Npb25fcmVxdWVzdGVkJztcbiAgcHJpdmF0ZSBvbkluaXRDb21wbGV0ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBvbkxvYWRpbmdMb2NhbGl6YXRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSBjb25maWc6IE5vdGlDb25maWd1cmF0aW9ucztcbiAgcHJpdmF0ZSBuZWVkTG9hZExvY2FsaXphdGlvbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIHByaXZhdGUgaHR0cDogSHR0cFByb3ZpZGVyLFxuICAgIHByaXZhdGUgY2RzTGFuZzogQ2RzTGFuZ1NlcnZpY2VcbiAgKSB7XG4gICAgdGhpcy5oYW5kbGVPbk5vdGlmaWNhdGlvbnNDbGljaygpO1xuICAgIHRoaXMuaGFuZGxlT25Gb3JlZ3JvdW5kV2lsbERpc3BsYXkoKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXROb3RpZmljYXRpb25TdWJEYXRhKCk6IFN1YmplY3Q8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMuX25vdGlmaWNhdGlvblN1YkRhdGE7XG4gIH1cblxuICBzZXR1cFB1c2hOb3RpZmljYXRpb25zKFxuICAgIG9uZVNpZ25hbEFwcElkOiBzdHJpbmcgPSAnJyxcbiAgICBob3N0OiBOb3RpQXBpLFxuICAgIGNvbmZpZzogTm90aUNvbmZpZ3VyYXRpb25zLFxuICAgIG5lZWRMb2FkTG9jYWxpemF0aW9uOiBib29sZWFuID0gZmFsc2VcbiAgKTogU3ViamVjdDxhbnk+IHtcbiAgICB0aGlzLl9ub3RpZmljYXRpb25TdWJEYXRhID0gbmV3IFN1YmplY3QoKTtcbiAgICB0aGlzLmhvc3QgPSBob3N0O1xuICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xuICAgIHRoaXMubmVlZExvYWRMb2NhbGl6YXRpb24gPSBuZWVkTG9hZExvY2FsaXphdGlvbjtcbiAgICBpZiAoQ2FwYWNpdG9yLmlzTmF0aXZlUGxhdGZvcm0oKSkge1xuICAgICAgdGhpcy5wbGF0Zm9ybS5yZWFkeSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAnPT0+c2V0dXBQdXNoTm90aWZpY2F0aW9uLW9uZVNpZ25hbEFwcElEOj4+ICcgKyBvbmVTaWduYWxBcHBJZFxuICAgICAgICApO1xuICAgICAgICBpZiAoIW9uZVNpZ25hbEFwcElkKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJz09PnNldHVwUHVzaE5vdGlmaWNhdGlvbiBmYWlsZWQtaW52YWxpZCBhcHBJZCcpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICh3aW5kb3cgYXMgYW55KS5wbHVnaW5zLk9uZVNpZ25hbC5Ob3RpZmljYXRpb25zLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgJ2NsaWNrJyxcbiAgICAgICAgICB0aGlzLm9uTm90aWZpY2F0aW9uc0NsaWNrXG4gICAgICAgICk7XG4gICAgICAgICh3aW5kb3cgYXMgYW55KS5wbHVnaW5zLk9uZVNpZ25hbC5Ob3RpZmljYXRpb25zLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgJ2ZvcmVncm91bmRXaWxsRGlzcGxheScsXG4gICAgICAgICAgdGhpcy5mb3JlZ3JvdW5kV2lsbERpc3BsYXlcbiAgICAgICAgKTtcbiAgICAgICAgKHdpbmRvdyBhcyBhbnkpLnBsdWdpbnMuT25lU2lnbmFsLmluaXRpYWxpemUob25lU2lnbmFsQXBwSWQpO1xuXG4gICAgICAgIC8vIFByb21wdHMgdGhlIHVzZXIgZm9yIG5vdGlmaWNhdGlvbiBwZXJtaXNzaW9ucy5cbiAgICAgICAgLy8gU2luY2UgdGhpcyBzaG93cyBhIGdlbmVyaWMgbmF0aXZlIHByb21wdCwgd2UgcmVjb21tZW5kIGluc3RlYWQgdXNpbmcgYW4gSW4tQXBwIE1lc3NhZ2UgdG8gcHJvbXB0IGZvciBub3RpZmljYXRpb24gcGVybWlzc2lvbiAoU2VlIHN0ZXAgNykgdG8gYmV0dGVyIGNvbW11bmljYXRlIHRvIHlvdXIgdXNlcnMgd2hhdCBub3RpZmljYXRpb25zIHRoZXkgd2lsbCBnZXQuXG4gICAgICAgIHRoaXMuY2hlY2tUb1JlcXVlc3RQZXJtaXNzaW9ucygpO1xuICAgICAgICB0aGlzLmxvYWRMb2NhbGl6YXRpb25TdWIoKS5zdWJzY3JpYmUoKHN0YXR1cykgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCc9PT5ub3RpIHNlcnZpY2UgbG9hZCBseiBzdWNjZXNzIDo+PiAnLCBzdGF0dXMpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5sb2FkTG9jYWxpemF0aW9uKCk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX25vdGlmaWNhdGlvblN1YkRhdGE7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrVG9SZXF1ZXN0UGVybWlzc2lvbnMoKSB7XG4gICAgdGhpcy5nZXRQZXJtaXNzaW9uUmVxdWVzdGVkU3RhdHVzKCkudGhlbigoc3RhdHVzKSA9PiB7XG4gICAgICBpZiAoc3RhdHVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCc9PT5jaGVja1RvUmVxdWVzdFBlcm1pc3Npb25zLSByZXF1ZXN0ZWQgYWxyZWFkeScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAod2luZG93IGFzIGFueSkucGx1Z2lucy5PbmVTaWduYWwuTm90aWZpY2F0aW9ucy5yZXF1ZXN0UGVybWlzc2lvbihcbiAgICAgICAgdHJ1ZVxuICAgICAgKS50aGVuKChhY2NlcHRlZDogYm9vbGVhbikgPT4ge1xuICAgICAgICBpZiAoYWNjZXB0ZWQpIHtcbiAgICAgICAgICB0aGlzLnNldFBlcm1pc3Npb25SZXF1ZXN0ZWRTdGF0dXModHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBvbk5vdGlmaWNhdGlvbnNDbGljayhkYXRhOiBhbnkpIHtcbiAgICBjb25zdCBjdXN0b21FdmVudCA9IG5ldyBDdXN0b21FdmVudCgnaGFuZGxlT25Ob3RpZmljYXRpb25zQ2xpY2snLCB7XG4gICAgICBkZXRhaWw6IHtcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgLy8gZGlzcGF0Y2ggZXZlbnQgdG8gcmVzb2x2ZSBPbmVTaWduYWwncyBsaXN0ZW5lciBzY29kZSBpc3N1ZXMuXG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoY3VzdG9tRXZlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVPbk5vdGlmaWNhdGlvbnNDbGljaygpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFuZGxlT25Ob3RpZmljYXRpb25zQ2xpY2snLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgdmFyIGRhdGEgPSBldmVudC5kZXRhaWwuZGF0YTtcbiAgICAgIGNvbnN0IGFkZGl0aW9uYWxkYXRhID0gZGF0YT8ubm90aWZpY2F0aW9uPy5hZGRpdGlvbmFsRGF0YTtcbiAgICAgIGNvbnNvbGUubG9nKCc9PT5oYW5kbGVPbk5vdGlmaWNhdGlvbnNDbGljazo+PiAnLCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgICBjb25zdCBkZWVwTGlua0RhdGEgPSB0aGlzLnBhcnNlRGVlcGxpbmsoYWRkaXRpb25hbGRhdGEpO1xuICAgICAgdGhpcy5fbm90aWZpY2F0aW9uU3ViRGF0YS5uZXh0KGRlZXBMaW5rRGF0YSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgZGF0YSA9IHtcbiAgICAgIHB1c2hOb3RpZmljYXRpb25JZDogJzEyMycsXG4gICAgICBldmVudFR5cGU6IG5vdGlmaWNhdGlvbldpbGxEaXNwbGF5RXZlbnQgb3Igbm90aWZpY2F0aW9uQ2xpY2tFdmVudFxuICAgICAgZGVlcExpbmtUeXBlOiAnYXBwJyxcbiAgICAgIGxhbmRpbmdQYWdlOiB7XG4gICAgICAgIHZpOiAncG9ydGZvbGlvJyxcbiAgICAgICAgZW46ICdwb3J0Zm9saW8nXG4gICAgICB9LFxuICAgICAgbW9kZTogJ2luLWFwcCdcbiAgICB9O1xuICAgKi9cbiAgcHJpdmF0ZSBwYXJzZURlZXBsaW5rKGFkZGl0aW9uYWxkYXRhOiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IGxhbmRpbmdQYWdlID0gYWRkaXRpb25hbGRhdGE/LmxhbmRpbmdQYWdlO1xuICAgIGlmIChsYW5kaW5nUGFnZSAmJiB0aGlzLmlzVmFsaWRMYW5kaW5nUGFnZShsYW5kaW5nUGFnZSkpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIGV2ZW50VHlwZTogTm90aWZpY2F0aW9uRXZlbnQubm90aWZpY2F0aW9uQ2xpY2ssXG4gICAgICAgIHB1c2hOb3RpZmljYXRpb25JZDogYWRkaXRpb25hbGRhdGE/LnB1c2hOb3RpZmljYXRpb25JZCxcbiAgICAgICAgZGVlcExpbmtUeXBlOiAnYXBwJyxcbiAgICAgICAgbGFuZGluZ1BhZ2U6IHtcbiAgICAgICAgICBlbjogbGFuZGluZ1BhZ2UsXG4gICAgICAgIH0sXG4gICAgICAgIG1vZGU6ICdpbi1hcHAnLFxuICAgICAgfTtcbiAgICAgIHJldHVybiBkYXRhO1xuICAgIH0gZWxzZSBpZiAoYWRkaXRpb25hbGRhdGE/LmV4dGVybmFsTGluaykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgZXh0ZXJuYWxMaW5rID0gSlNPTi5wYXJzZShhZGRpdGlvbmFsZGF0YT8uZXh0ZXJuYWxMaW5rKTtcbiAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICBldmVudFR5cGU6IE5vdGlmaWNhdGlvbkV2ZW50Lm5vdGlmaWNhdGlvbkNsaWNrLFxuICAgICAgICAgIHB1c2hOb3RpZmljYXRpb25JZDogYWRkaXRpb25hbGRhdGE/LnB1c2hOb3RpZmljYXRpb25JZCxcbiAgICAgICAgICBkZWVwTGlua1R5cGU6ICd3ZWJzaXRlJyxcbiAgICAgICAgICBsYW5kaW5nUGFnZTogZXh0ZXJuYWxMaW5rPy51cmxzLFxuICAgICAgICAgIG1vZGU6IGV4dGVybmFsTGluaz8ubW9kZSxcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZygnPT0+cGFyc2VEZWVwbGluayAtIHBhcnNlIGRhdGEgZXJyb3IgOj4+ICcsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgZXZlbnRUeXBlOiBOb3RpZmljYXRpb25FdmVudC5ub3RpZmljYXRpb25DbGljayxcbiAgICAgICAgcHVzaE5vdGlmaWNhdGlvbklkOiBhZGRpdGlvbmFsZGF0YT8ucHVzaE5vdGlmaWNhdGlvbklkLFxuICAgICAgICBsYW5kaW5nUGFnZTogbnVsbCxcbiAgICAgIH07XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGZvcmVncm91bmRXaWxsRGlzcGxheShkYXRhOiBhbnkpIHtcbiAgICBjb25zdCBjdXN0b21FdmVudCA9IG5ldyBDdXN0b21FdmVudCgnaGFuZGxlT25Gb3JlZ3JvdW5kV2lsbERpc3BsYXknLCB7XG4gICAgICBkZXRhaWw6IHtcbiAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgLy8gZGlzcGF0Y2ggZXZlbnQgdG8gcmVzb2x2ZSBPbmVTaWduYWwncyBsaXN0ZW5lciBzY29kZSBpc3N1ZXMuXG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoY3VzdG9tRXZlbnQpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVPbkZvcmVncm91bmRXaWxsRGlzcGxheSgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFuZGxlT25Gb3JlZ3JvdW5kV2lsbERpc3BsYXknLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgY29uc3QgZXZlbnREYXRhID0ge1xuICAgICAgICBldmVudFR5cGU6IE5vdGlmaWNhdGlvbkV2ZW50Lm5vdGlmaWNhdGlvbldpbGxEaXNwbGF5LFxuICAgICAgICBkYXRhOiBldmVudD8uZGV0YWlsPy5kYXRhLFxuICAgICAgfTtcbiAgICAgIHRoaXMuX25vdGlmaWNhdGlvblN1YkRhdGEubmV4dChldmVudERhdGEpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBpc1ZhbGlkTGFuZGluZ1BhZ2UobGFuZGluZ1BhZ2U6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIC8vIFRPRE86IGltcGxlbWVudCBsb2dpYyB0byB2YWxpZGF0ZSB1cmxcbiAgICBpZiAobGFuZGluZ1BhZ2UpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRPblNpZ25hbFN1YnNjcml0aW9uSWQoKTogT2JzZXJ2YWJsZTxhbnk+IHtcbiAgICBpZiAoIUNhcGFjaXRvci5pc05hdGl2ZVBsYXRmb3JtKCkpIHtcbiAgICAgIHJldHVybiBvZignJyk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnJvbShcbiAgICAgICAgKHdpbmRvdyBhcyBhbnkpLnBsdWdpbnMuT25lU2lnbmFsLlVzZXIucHVzaFN1YnNjcmlwdGlvbi5nZXRJZEFzeW5jKClcbiAgICAgICk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJldHVybiBvZignJyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHNldE5vdGlmaWNhdGlvbnNEYXRhKGRhdGE6IGFueSkge1xuICAgIGNvbnN0IHZhbHVlID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgUHJlZmVyZW5jZXMuc2V0KHtcbiAgICAgIGtleTogTm90aVNlc3Npb25TdG9yYWdlS2V5cy5OT1RJRklDQVRJT05TX0RBVEEsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZ2V0Tm90aWZpY2F0aW9uc0RhdGEoKTogUHJvbWlzZTxhbnk+IHtcbiAgICByZXR1cm4gKFxuICAgICAgYXdhaXQgUHJlZmVyZW5jZXMuZ2V0KHsga2V5OiBOb3RpU2Vzc2lvblN0b3JhZ2VLZXlzLk5PVElGSUNBVElPTlNfREFUQSB9KVxuICAgICk/LnZhbHVlO1xuICB9XG5cbiAgcmVnaXN0ZXJOb3RpZmljYXRpb25zKFxuICAgIG1jZklkOiBzdHJpbmcsXG4gICAgbGFuZzogc3RyaW5nLFxuICAgIGFwaUNyZWRlbnRpYWxzOiBhbnkgPSB7fSxcbiAgICB1cGRhdGVMYW5ndWFnZU9ubHk6IGJvb2xlYW4gPSBmYWxzZVxuICApOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmICghbWNmSWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKCc9PT5yZWdpc3Rlck5vdGlmaWNhdGlvbnMgZmFpbGVkLWludmFsaWQgZGF0YScpO1xuICAgICAgcmV0dXJuIG9mKG51bGwpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5nZXRPblNpZ25hbFN1YnNjcml0aW9uSWQoKS5waXBlKFxuICAgICAgc3dpdGNoTWFwKChzdWJJZCkgPT4ge1xuICAgICAgICBpZiAoQ2FwYWNpdG9yLmlzTmF0aXZlUGxhdGZvcm0oKSAmJiAhc3ViSWQpIHtcbiAgICAgICAgICByZXR1cm4gb2YobnVsbCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGF0YSA9IHtcbiAgICAgICAgICBkZXZpY2VJZDogc3ViSWQsXG4gICAgICAgICAgbGFuZ3VhZ2U6IGxhbmcsXG4gICAgICAgICAgbWNmSWQ6IG1jZklkLFxuICAgICAgICAgIHVwZGF0ZUxhbmd1YWdlT25seTogdXBkYXRlTGFuZ3VhZ2VPbmx5LFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmdldEhlYWx0aEFwaVVybCh0aGlzLmhvc3QpO1xuICAgICAgICByZXR1cm4gdGhpcy5odHRwLnBvc3QodXJsLCBkYXRhLCB7IGhlYWRlcnM6IGFwaUNyZWRlbnRpYWxzIH0pLnBpcGUoXG4gICAgICAgICAgdGFrZSgxKSxcbiAgICAgICAgICBtYXAoKHJlc3BvbnNlOiBhbnkpID0+IHJlc3BvbnNlKSxcbiAgICAgICAgICBjYXRjaEVycm9yKChlcnIpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAnPT0+cmVnaXN0ZXJOb3RpZmljYXRpb25zIGVycm9yIDo+PiAnICsgSlNPTi5zdHJpbmdpZnkoZXJyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiBvZihudWxsKTtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRIZWFsdGhBcGlVcmwoaG9zdDogTm90aUFwaSkge1xuICAgIHJldHVybiBgJHtob3N0LnVyaX0vJHtob3N0LnZlcnNpb259LyR7aG9zdC5lbmRwb2ludH1gO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRQZXJtaXNzaW9uUmVxdWVzdGVkU3RhdHVzKHN0YXR1czogYm9vbGVhbikge1xuICAgIFByZWZlcmVuY2VzLnNldCh7XG4gICAgICBrZXk6IE5vdGlTZXNzaW9uU3RvcmFnZUtleXMuS0VZX09ORV9TSUdOQUxfUkVHSVNURVJFRCxcbiAgICAgIHZhbHVlOiBzdGF0dXMgPyB0aGlzLlBFUk1JU1NJT05fUkVRVUVTVEVEX1NUQVRVUyA6ICcnLFxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBnZXRQZXJtaXNzaW9uUmVxdWVzdGVkU3RhdHVzKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiAoXG4gICAgICAoXG4gICAgICAgIGF3YWl0IFByZWZlcmVuY2VzLmdldCh7XG4gICAgICAgICAga2V5OiBOb3RpU2Vzc2lvblN0b3JhZ2VLZXlzLktFWV9PTkVfU0lHTkFMX1JFR0lTVEVSRUQsXG4gICAgICAgIH0pXG4gICAgICApPy52YWx1ZSA9PT0gdGhpcy5QRVJNSVNTSU9OX1JFUVVFU1RFRF9TVEFUVVNcbiAgICApO1xuICB9XG5cbiAgbG9hZExvY2FsaXphdGlvblN1YigpOiBTdWJqZWN0PGJvb2xlYW4+IHtcbiAgICBpZiAodGhpcy5fbG9hZExvY2FsaXphdGlvblN1YiA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5fbG9hZExvY2FsaXphdGlvblN1YiA9IG5ldyBTdWJqZWN0KCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9sb2FkTG9jYWxpemF0aW9uU3ViO1xuICB9XG5cbiAgbG9hZExvY2FsaXphdGlvbigpIHtcbiAgICBpZiAoIXRoaXMubmVlZExvYWRMb2NhbGl6YXRpb24pIHtcbiAgICAgIHRoaXMub25Jbml0Q29tcGxldGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuX2xvYWRMb2NhbGl6YXRpb25TdWIubmV4dCh0cnVlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLm9uTG9hZGluZ0xvY2FsaXphdGlvbikge1xuICAgICAgdGhpcy5vbkxvYWRpbmdMb2NhbGl6YXRpb24gPSB0cnVlO1xuICAgICAgdGhpcy5sb2FkTG9jYWxpemF0aW9uRnJvbVJlbW90ZSgpLnN1YnNjcmliZSgoc3RhdHVzKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCc9PT5sb2FkTG9jYWxpemF0aW9uLXN0YXR1cyA6Pj4gJywgc3RhdHVzKTtcbiAgICAgICAgdGhpcy5vbkxvYWRpbmdMb2NhbGl6YXRpb24gPSBmYWxzZTtcbiAgICAgICAgdGhpcy5vbkluaXRDb21wbGV0ZWQgPSAhIXN0YXR1cztcbiAgICAgICAgdGhpcy5fbG9hZExvY2FsaXphdGlvblN1Yi5uZXh0KCEhc3RhdHVzKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbG9hZExvY2FsaXphdGlvbkZyb21SZW1vdGUoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgaWYgKCF0aGlzLmNvbmZpZyB8fCAhdGhpcy5jb25maWcubG9jYWxpemVDb25maWdQYXRoKSB7XG4gICAgICByZXR1cm4gb2YoZmFsc2UpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMub25Jbml0Q29tcGxldGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5jZHNMYW5nXG4gICAgICAgIC5hZGRMYW5nRW50cmllc0J5VXJsKHRoaXMuY29uZmlnLmxvY2FsaXplQ29uZmlnUGF0aClcbiAgICAgICAgLnBpcGUoXG4gICAgICAgICAgZmlyc3QoKSxcbiAgICAgICAgICBtYXAoKGRhdGEpID0+ICEhZGF0YSksXG4gICAgICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgJz09PmxvYWRMb2NhbGl6YXRpb25Gcm9tUmVtb3RlIGZyb20gcmVtb3RlLWVycm9yOiAnLFxuICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeShlcnIpXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9hZExvY2FsaXphdGlvbkZyb21Bc3Nlc3QoKTtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2YodHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBsb2FkTG9jYWxpemF0aW9uRnJvbUFzc2VzdCgpOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGNvbnN0IGxvY2FsaXplQ29uZmlnUGF0aCA9ICdhc3NldHMvbG9jYWxpemF0aW9ucy9ub3RpZmljYXRpb25zLmpzb24nO1xuICAgIHJldHVybiB0aGlzLmNkc0xhbmcuYWRkTGFuZ0VudHJpZXNCeVVybChsb2NhbGl6ZUNvbmZpZ1BhdGgpLnBpcGUoXG4gICAgICBmaXJzdCgpLFxuICAgICAgbWFwKChkYXRhKSA9PiAhIWRhdGEpLFxuICAgICAgY2F0Y2hFcnJvcigoZXJyKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICc9PT5sb2FkTG9jYWxpemF0aW9uRnJvbUFzc2VzdC1lcnJvcjogJyxcbiAgICAgICAgICBKU09OLnN0cmluZ2lmeShlcnIpXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBvZihmYWxzZSk7XG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBzYXZlTm90aWZpY2F0aW9uU3RhdHVzKHN0YXR1czogYm9vbGVhbikge1xuICAgIFByZWZlcmVuY2VzLnNldCh7XG4gICAgICBrZXk6IE5vdGlTZXNzaW9uU3RvcmFnZUtleXMuS0VZX05PVElGSUNBVElPTl9TVEFUVVMsXG4gICAgICB2YWx1ZTogc3RhdHVzID8gJ29uJyA6ICdvZmYnLFxuICAgIH0pO1xuICB9XG5cbiAgYXN5bmMgZ2V0U2F2ZWROb3RpZmljYXRpb25TdGF0dXMoKTogUHJvbWlzZTxib29sZWFuIHwgdW5kZWZpbmVkPiB7XG4gICAgY29uc3QgZGF0YSA9IGF3YWl0IFByZWZlcmVuY2VzLmdldCh7XG4gICAgICBrZXk6IE5vdGlTZXNzaW9uU3RvcmFnZUtleXMuS0VZX05PVElGSUNBVElPTl9TVEFUVVMsXG4gICAgfSk7XG4gICAgaWYgKCFkYXRhIHx8ICFkYXRhPy52YWx1ZSkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGE/LnZhbHVlID09PSAnb24nO1xuICB9XG59XG4iXX0=