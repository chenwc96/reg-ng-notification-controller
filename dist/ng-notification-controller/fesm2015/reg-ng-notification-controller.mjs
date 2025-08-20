import * as i0 from '@angular/core';
import { Component, Input, HostBinding, NgModule, EventEmitter, Output, CUSTOM_ELEMENTS_SCHEMA, InjectionToken, Injectable, Optional, Inject } from '@angular/core';
import * as i3 from '@cds/ng-core/lang';
import { CdsLangPipe, CdsLanguageModule } from '@cds/ng-core/lang';
import * as i2 from '@angular/common';
import { CommonModule } from '@angular/common';
import * as i1 from '@cds/ng-ionic-components/bottom-sheet';
import { CdsBottomSheetModule } from '@cds/ng-ionic-components/bottom-sheet';
import * as i2$1 from '@cds/ng-adobe-analytics';
import * as i5 from '@cds/ng-web-components/button';
import { CdsButtonModule } from '@cds/ng-web-components/button';
import * as i6 from '@angular/forms';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { App } from '@capacitor/app';
import { from, Subject, of, switchMap, take, map as map$1, catchError as catchError$1, first, distinctUntilChanged, finalize, Observable } from 'rxjs';
import { Notifications } from '@reg/ng-notification-plugin';
import { CapacitorHttp, Capacitor } from '@capacitor/core';
import { __awaiter } from 'tslib';
import { Preferences } from '@capacitor/preferences';
import * as i1$2 from '@ionic/angular';
import { isPlatform } from '@ionic/angular';
import * as i1$1 from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { MatDialogModule } from '@angular/material/dialog';
import { CdsIonSwitchModule } from '@cds/ng-ionic-components/switch';
import { CdsIonTopBarModule } from '@cds/ng-ionic-components/top-bar';
import { CdsIconModule } from '@cds/ng-web-components/icon';
import { CdsPopupModule } from '@cds/ng-web-components/popup';

class MLCaptionComponent {
    /**
     * Provides string value from fieldId input and provides translation based on current language.
     * Replaces {mli-param} parameter from .json field with uiCaptionParam value.
     * @returns {string} String value of fieldId.
     */
    get caption() {
        if (typeof this.fieldId == 'string') {
            let text = this.translatePipe.transform(this.fieldId);
            text = text.replace(this.REPLACE_PARAM, this.uiCaptionParam || '');
            return text;
        }
        return this.fieldId;
    }
    constructor(translatePipe) {
        this.translatePipe = translatePipe;
        this.REPLACE_PARAM = '{mli-param}';
        this.uiCaptionParam = '';
        this.id = '';
    }
}
MLCaptionComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: MLCaptionComponent, deps: [{ token: i3.CdsLangPipe }], target: i0.ɵɵFactoryTarget.Component });
MLCaptionComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.10", type: MLCaptionComponent, selector: "ml-caption", inputs: { uiCaptionParam: "uiCaptionParam", fieldId: "fieldId" }, host: { properties: { "attr.id": "this.id" } }, ngImport: i0, template: "<p *ngIf=\"caption\" [innerHTML]=\"caption\"></p>\n", styles: [":host>p{display:initial}\n"], dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: MLCaptionComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ml-caption', template: "<p *ngIf=\"caption\" [innerHTML]=\"caption\"></p>\n", styles: [":host>p{display:initial}\n"] }]
        }], ctorParameters: function () { return [{ type: i3.CdsLangPipe }]; }, propDecorators: { uiCaptionParam: [{
                type: Input
            }], fieldId: [{
                type: Input
            }], id: [{
                type: HostBinding,
                args: ['attr.id']
            }] } });

class MLCaptionModule {
}
MLCaptionModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: MLCaptionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MLCaptionModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.10", ngImport: i0, type: MLCaptionModule, declarations: [MLCaptionComponent], imports: [CommonModule], exports: [MLCaptionComponent] });
MLCaptionModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: MLCaptionModule, providers: [CdsLangPipe], imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: MLCaptionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    declarations: [MLCaptionComponent],
                    exports: [MLCaptionComponent],
                    providers: [CdsLangPipe]
                }]
        }] });

class TurnOnNotificationsSheet {
    constructor(sheetRef, adobeAnalytics, cdsLangService) {
        this.sheetRef = sheetRef;
        this.adobeAnalytics = adobeAnalytics;
        this.cdsLangService = cdsLangService;
        this.isProceed = new EventEmitter();
    }
    ngOnInit() {
        var _a;
        this.adobeAnalytics.trackCommonEvent('popUpDisplay', {
            title: (_a = this.getTranslation('notifications_turn_on_popup_title')) !== null && _a !== void 0 ? _a : 'Turn on notifications',
        });
    }
    cancel() {
        var _a;
        this.adobeAnalytics.trackCommonEvent('buttonClick', {
            label: (_a = this.getTranslation('notifications_turn_on_cta1')) !== null && _a !== void 0 ? _a : 'Not now',
        });
        this.isProceed.emit(false);
        this.sheetRef.dismiss();
    }
    proceed() {
        var _a;
        this.adobeAnalytics.trackCommonEvent('buttonClick', {
            label: (_a = this.getTranslation('notifications_turn_on_cta2')) !== null && _a !== void 0 ? _a : 'Turn on',
        });
        this.isProceed.emit(true);
        this.sheetRef.dismiss();
    }
    getTranslation(key) {
        const entries = this.cdsLangService.getLangEntriesById(key);
        return entries ? entries['en'] : null;
    }
}
TurnOnNotificationsSheet.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: TurnOnNotificationsSheet, deps: [{ token: i1.CdsBottomSheetRef }, { token: i2$1.AdobeAnalyticsService }, { token: i3.CdsLangService }], target: i0.ɵɵFactoryTarget.Component });
TurnOnNotificationsSheet.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.10", type: TurnOnNotificationsSheet, selector: "lib-turn-on-notifications", outputs: { isProceed: "isProceed" }, ngImport: i0, template: "<div class=\"row noti-popup\">\n  <ml-caption\n    [fieldId]=\"'notifications_turn_on_popup_title'\"\n    class=\"col-xs-12 cds-body-hero cds-light\"\n  ></ml-caption>\n  <ml-caption\n    [fieldId]=\"'notifications_turn_on_popup_desc'\"\n    class=\"col-xs-12\"\n  ></ml-caption>\n  <div class=\"col-xs-12 actions\">\n    <cds-button\n      class=\"cta\"\n      [fullWidth]=\"true\"\n      [config]=\"{ style: 'secondary' }\"\n      (click)=\"cancel()\"\n      [label]=\"'notifications_turn_on_cta1'\"\n    ></cds-button>\n    <cds-button\n      class=\"cta\"\n      [fullWidth]=\"true\"\n      (click)=\"proceed()\"\n      [label]=\"'notifications_turn_on_cta2'\"\n    ></cds-button>\n  </div>\n</div>\n", styles: ["@import\"../../../../../../node_modules/@cds/style-dictionary/css/_grid.css\";.noti-popup{width:100%;padding-top:var(--cds-spacing-06);padding-bottom:calc(var(--cds-spacing-04) + var(--ion-safe-area-bottom))}.row,.actions{gap:var(--cds-spacing-04)}.actions{display:flex;justify-content:space-between}.cta{flex-grow:1}.cds-body-hero{margin:0}\n"], dependencies: [{ kind: "component", type: MLCaptionComponent, selector: "ml-caption", inputs: ["uiCaptionParam", "fieldId"] }, { kind: "component", type: i5.CdsButtonComponent, selector: "cds-button" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: TurnOnNotificationsSheet, decorators: [{
            type: Component,
            args: [{ selector: 'lib-turn-on-notifications', template: "<div class=\"row noti-popup\">\n  <ml-caption\n    [fieldId]=\"'notifications_turn_on_popup_title'\"\n    class=\"col-xs-12 cds-body-hero cds-light\"\n  ></ml-caption>\n  <ml-caption\n    [fieldId]=\"'notifications_turn_on_popup_desc'\"\n    class=\"col-xs-12\"\n  ></ml-caption>\n  <div class=\"col-xs-12 actions\">\n    <cds-button\n      class=\"cta\"\n      [fullWidth]=\"true\"\n      [config]=\"{ style: 'secondary' }\"\n      (click)=\"cancel()\"\n      [label]=\"'notifications_turn_on_cta1'\"\n    ></cds-button>\n    <cds-button\n      class=\"cta\"\n      [fullWidth]=\"true\"\n      (click)=\"proceed()\"\n      [label]=\"'notifications_turn_on_cta2'\"\n    ></cds-button>\n  </div>\n</div>\n", styles: ["@import\"../../../../../../node_modules/@cds/style-dictionary/css/_grid.css\";.noti-popup{width:100%;padding-top:var(--cds-spacing-06);padding-bottom:calc(var(--cds-spacing-04) + var(--ion-safe-area-bottom))}.row,.actions{gap:var(--cds-spacing-04)}.actions{display:flex;justify-content:space-between}.cta{flex-grow:1}.cds-body-hero{margin:0}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.CdsBottomSheetRef }, { type: i2$1.AdobeAnalyticsService }, { type: i3.CdsLangService }]; }, propDecorators: { isProceed: [{
                type: Output
            }] } });

class TurnOnNotificationsSheetModule {
}
TurnOnNotificationsSheetModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: TurnOnNotificationsSheetModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TurnOnNotificationsSheetModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.10", ngImport: i0, type: TurnOnNotificationsSheetModule, declarations: [TurnOnNotificationsSheet], imports: [CommonModule, MLCaptionModule, CdsButtonModule], exports: [TurnOnNotificationsSheet] });
TurnOnNotificationsSheetModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: TurnOnNotificationsSheetModule, providers: [CdsLangPipe], imports: [CommonModule, MLCaptionModule, CdsButtonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: TurnOnNotificationsSheetModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MLCaptionModule, CdsButtonModule],
                    declarations: [TurnOnNotificationsSheet],
                    exports: [TurnOnNotificationsSheet],
                    providers: [CdsLangPipe],
                    schemas: [CUSTOM_ELEMENTS_SCHEMA]
                }]
        }] });

class TurnOffNotificationsSheet {
    constructor(sheetRef, adobeAnalytics, cdsLangService) {
        this.sheetRef = sheetRef;
        this.adobeAnalytics = adobeAnalytics;
        this.cdsLangService = cdsLangService;
        this.isProceed = new EventEmitter();
    }
    ngOnInit() {
        var _a;
        this.adobeAnalytics.trackCommonEvent('popUpDisplay', {
            title: (_a = this.getTranslation('notifications_turn_off_popup_title')) !== null && _a !== void 0 ? _a : 'Turn off notifications',
        });
    }
    cancel() {
        var _a;
        this.adobeAnalytics.trackCommonEvent('buttonClick', {
            label: (_a = this.getTranslation('notifications_turn_off_cta1')) !== null && _a !== void 0 ? _a : 'Not now',
        });
        this.isProceed.emit(false);
        this.sheetRef.dismiss();
    }
    proceed() {
        var _a;
        this.adobeAnalytics.trackCommonEvent('buttonClick', {
            label: (_a = this.getTranslation('notifications_turn_off_cta2')) !== null && _a !== void 0 ? _a : 'Turn off',
        });
        this.isProceed.emit(true);
        this.sheetRef.dismiss();
    }
    getTranslation(key) {
        const entries = this.cdsLangService.getLangEntriesById(key);
        return entries ? entries['en'] : null;
    }
}
TurnOffNotificationsSheet.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: TurnOffNotificationsSheet, deps: [{ token: i1.CdsBottomSheetRef }, { token: i2$1.AdobeAnalyticsService }, { token: i3.CdsLangService }], target: i0.ɵɵFactoryTarget.Component });
TurnOffNotificationsSheet.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.10", type: TurnOffNotificationsSheet, selector: "lib-turn-off-notifications", outputs: { isProceed: "isProceed" }, ngImport: i0, template: "<div class=\"row noti-popup\">\n  <ml-caption\n    [fieldId]=\"'notifications_turn_off_popup_title'\"\n    class=\"col-xs-12 cds-body-hero cds-light\"\n  ></ml-caption>\n  <ml-caption\n    [fieldId]=\"'notifications_turn_off_popup_desc'\"\n    class=\"col-xs-12\"\n  ></ml-caption>\n  <div class=\"col-xs-12 actions\">\n    <cds-button\n      class=\"cta\"\n      fullWidth=\"true\"\n      (click)=\"cancel()\"\n      [label]=\"'notifications_turn_off_cta1'\"\n    ></cds-button>\n    <cds-button\n      class=\"cta\"\n      fullWidth=\"true\"\n      [config]=\"{ style: 'secondary' }\"\n      (click)=\"proceed()\"\n      [label]=\"'notifications_turn_off_cta2'\"\n    ></cds-button>\n  </div>\n</div>\n", styles: ["@import\"../../../../../../node_modules/@cds/style-dictionary/css/_grid.css\";.noti-popup{width:100%;padding-top:var(--cds-spacing-06);padding-bottom:calc(var(--cds-spacing-04) + var(--ion-safe-area-bottom))}.row,.actions{gap:var(--cds-spacing-04)}.actions{display:flex;justify-content:space-between}.cta{flex-grow:1}.cds-body-hero{margin:0}\n"], dependencies: [{ kind: "component", type: MLCaptionComponent, selector: "ml-caption", inputs: ["uiCaptionParam", "fieldId"] }, { kind: "component", type: i5.CdsButtonComponent, selector: "cds-button" }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: TurnOffNotificationsSheet, decorators: [{
            type: Component,
            args: [{ selector: 'lib-turn-off-notifications', template: "<div class=\"row noti-popup\">\n  <ml-caption\n    [fieldId]=\"'notifications_turn_off_popup_title'\"\n    class=\"col-xs-12 cds-body-hero cds-light\"\n  ></ml-caption>\n  <ml-caption\n    [fieldId]=\"'notifications_turn_off_popup_desc'\"\n    class=\"col-xs-12\"\n  ></ml-caption>\n  <div class=\"col-xs-12 actions\">\n    <cds-button\n      class=\"cta\"\n      fullWidth=\"true\"\n      (click)=\"cancel()\"\n      [label]=\"'notifications_turn_off_cta1'\"\n    ></cds-button>\n    <cds-button\n      class=\"cta\"\n      fullWidth=\"true\"\n      [config]=\"{ style: 'secondary' }\"\n      (click)=\"proceed()\"\n      [label]=\"'notifications_turn_off_cta2'\"\n    ></cds-button>\n  </div>\n</div>\n", styles: ["@import\"../../../../../../node_modules/@cds/style-dictionary/css/_grid.css\";.noti-popup{width:100%;padding-top:var(--cds-spacing-06);padding-bottom:calc(var(--cds-spacing-04) + var(--ion-safe-area-bottom))}.row,.actions{gap:var(--cds-spacing-04)}.actions{display:flex;justify-content:space-between}.cta{flex-grow:1}.cds-body-hero{margin:0}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.CdsBottomSheetRef }, { type: i2$1.AdobeAnalyticsService }, { type: i3.CdsLangService }]; }, propDecorators: { isProceed: [{
                type: Output
            }] } });

class TurnOffNotificationsSheetModule {
}
TurnOffNotificationsSheetModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: TurnOffNotificationsSheetModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TurnOffNotificationsSheetModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.10", ngImport: i0, type: TurnOffNotificationsSheetModule, declarations: [TurnOffNotificationsSheet], imports: [CommonModule, MLCaptionModule, CdsButtonModule], exports: [TurnOffNotificationsSheet] });
TurnOffNotificationsSheetModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: TurnOffNotificationsSheetModule, providers: [CdsLangPipe], imports: [CommonModule, MLCaptionModule, CdsButtonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: TurnOffNotificationsSheetModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MLCaptionModule, CdsButtonModule],
                    declarations: [TurnOffNotificationsSheet],
                    exports: [TurnOffNotificationsSheet],
                    schemas: [CUSTOM_ELEMENTS_SCHEMA],
                    providers: [CdsLangPipe]
                }]
        }] });

const TOGGLE_TYPE = {
    TURN_ON: 'turn_on',
    TURN_OFF: 'turn_off',
};
const NotificationEvent = {
    notificationWillDisplay: 'notificationWillDisplayEvent',
    notificationClick: 'notificationClickEvent',
};

var NotiSessionStorageKeys;
(function (NotiSessionStorageKeys) {
    NotiSessionStorageKeys["ONE_SIGNAL_ID"] = "ONE_SIGNAL_ID";
    NotiSessionStorageKeys["ONE_SIGNAL_SUBSCRIPTION_ID"] = "ONE_SIGNAL_SUBSCRIPTION_ID";
    NotiSessionStorageKeys["NOTIFICATIONS_DATA"] = "NOTIFICATIONS_DATA";
    NotiSessionStorageKeys["KEY_ONE_SIGNAL_REGISTERED"] = "KEY_ONE_SIGNAL_REGISTERED";
    NotiSessionStorageKeys["KEY_NOTIFICATION_STATUS"] = "KEY_NOTIFICATION_STATUS";
})(NotiSessionStorageKeys || (NotiSessionStorageKeys = {}));

var RequestHeader;
(function (RequestHeader) {
    RequestHeader["AUTHORIZATION"] = "AUTHORIZATION";
    RequestHeader["X_API_KEY"] = "X-API-KEY";
    RequestHeader["CONTENT_TYPE"] = "Content-Type";
    RequestHeader["ORIGIN"] = "Origin";
    RequestHeader["X_MOBILE_APP"] = "X-MOBILE-APP";
    RequestHeader["X_MOBILE_PLATFORM"] = "X-MOBILE-PLATFORM";
})(RequestHeader || (RequestHeader = {}));

const MOBILE_APP_HTTP_ORIGIN = new InjectionToken('MOBILE_APP_HTTP_ORIGIN');
class HttpProvider {
    constructor(_http, mobileAppHttpOrigin) {
        this._http = _http;
        this.mobileAppHttpOrigin = mobileAppHttpOrigin;
        this._cookies = new Map();
        this.isCapacitor = isPlatform('capacitor');
        this.isCapacitor = isPlatform('capacitor');
    }
    buildCapacitorHeaders(method, url) {
        const origin = this.mobileAppHttpOrigin || window.location.origin;
        const header = {
            [RequestHeader.CONTENT_TYPE]: 'application/json',
            // [RequestHeader.ORIGIN]: origin,
            [RequestHeader.X_MOBILE_APP]: 'capacitor',
            [RequestHeader.X_MOBILE_PLATFORM]: isPlatform('ios') ? 'ios' : 'android',
        };
        return header;
    }
    get(url, _options) {
        if (this.isCapacitor) {
            const _url = new URL(url);
            _url.searchParams;
            const options = {
                headers: Object.assign(Object.assign({}, this.buildCapacitorHeaders('GET', url)), _options === null || _options === void 0 ? void 0 : _options.headers),
                url,
                params: _options === null || _options === void 0 ? void 0 : _options.params,
            };
            const startTime = new Date();
            return from(CapacitorHttp.get(options)).pipe(map((response) => this.handleCapacitorHttpRequest(response, startTime)), catchError((error) => {
                throw error;
            }));
        }
        return this._http.get(url, _options);
    }
    post(url, body, _options) {
        if (this.isCapacitor) {
            const options = {
                headers: Object.assign(Object.assign({}, this.buildCapacitorHeaders('POST', url)), _options === null || _options === void 0 ? void 0 : _options.headers),
                url,
                data: body || undefined,
            };
            const startTime = new Date();
            return from(CapacitorHttp.post(options)).pipe(map((response) => this.handleCapacitorHttpRequest(response, startTime)));
        }
        return this._http.post(url, body, _options);
    }
    handleCapacitorHttpRequest(response, startTime) {
        if (startTime) {
            const endTime = new Date();
            const timeToComplete = endTime.getTime() - startTime.getTime();
            console.log(`Time to complete request ${response.url}: ${timeToComplete}`);
        }
        if ((response === null || response === void 0 ? void 0 : response.error) || (response === null || response === void 0 ? void 0 : response.status) >= 400) {
            const error = typeof response.data === 'string'
                ? JSON.parse(response.data)
                : response.data;
            throw new HttpErrorResponse(Object.assign(Object.assign({}, response), { error, url: response.url, status: response.status, headers: response.headers }));
        }
        const headers = response === null || response === void 0 ? void 0 : response.headers;
        if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
                if (key.toLowerCase() === 'set-cookie') {
                    this.addCookies(value);
                }
            });
        }
        return response === null || response === void 0 ? void 0 : response.data;
    }
    addCookies(cookies) {
        const _cookies = cookies.split(', ');
        _cookies.forEach((cookie) => {
            const [key, value] = cookie.split('=');
            if (value) {
                this._cookies.set(key, value);
            }
        });
    }
    clearCookies() {
        this._cookies.clear();
    }
    get cookies() {
        const cookies = [];
        for (let [key, value] of this._cookies.entries()) {
            cookies.push(`${key}=${value}`);
        }
        return cookies.join('; ');
    }
}
HttpProvider.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: HttpProvider, deps: [{ token: i1$1.HttpClient }, { token: MOBILE_APP_HTTP_ORIGIN, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
HttpProvider.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: HttpProvider, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: HttpProvider, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () {
        return [{ type: i1$1.HttpClient }, { type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [MOBILE_APP_HTTP_ORIGIN]
                    }] }];
    } });

class NotificationsService {
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
        console.log('ini fesm2015')
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
            var _a;
            var data = event.detail.data;
            const additionaldata = (_a = data === null || data === void 0 ? void 0 : data.notification) === null || _a === void 0 ? void 0 : _a.additionalData;
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
        const landingPage = additionaldata === null || additionaldata === void 0 ? void 0 : additionaldata.landingPage;
        if (landingPage && this.isValidLandingPage(landingPage)) {
            const data = {
                eventType: NotificationEvent.notificationClick,
                pushNotificationId: additionaldata === null || additionaldata === void 0 ? void 0 : additionaldata.pushNotificationId,
                deepLinkType: 'app',
                landingPage: {
                    en: landingPage,
                },
                mode: 'in-app',
            };
            return data;
        }
        else if (additionaldata === null || additionaldata === void 0 ? void 0 : additionaldata.externalLink) {
            try {
                const externalLink = JSON.parse(additionaldata === null || additionaldata === void 0 ? void 0 : additionaldata.externalLink);
                const data = {
                    eventType: NotificationEvent.notificationClick,
                    pushNotificationId: additionaldata === null || additionaldata === void 0 ? void 0 : additionaldata.pushNotificationId,
                    deepLinkType: 'website',
                    landingPage: externalLink === null || externalLink === void 0 ? void 0 : externalLink.urls,
                    mode: externalLink === null || externalLink === void 0 ? void 0 : externalLink.mode,
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
                pushNotificationId: additionaldata === null || additionaldata === void 0 ? void 0 : additionaldata.pushNotificationId,
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
            var _a;
            const eventData = {
                eventType: NotificationEvent.notificationWillDisplay,
                data: (_a = event === null || event === void 0 ? void 0 : event.detail) === null || _a === void 0 ? void 0 : _a.data,
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
    getNotificationsData() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (_a = (yield Preferences.get({ key: NotiSessionStorageKeys.NOTIFICATIONS_DATA }))) === null || _a === void 0 ? void 0 : _a.value;
        });
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
            return this.http.post(url, data, { headers: apiCredentials }).pipe(take(1), map$1((response) => response), catchError$1((err) => {
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
    getPermissionRequestedStatus() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            return (((_a = (yield Preferences.get({
                key: NotiSessionStorageKeys.KEY_ONE_SIGNAL_REGISTERED,
            }))) === null || _a === void 0 ? void 0 : _a.value) === this.PERMISSION_REQUESTED_STATUS);
        });
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
                .pipe(first(), map$1((data) => !!data), catchError$1((err) => {
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
        return this.cdsLang.addLangEntriesByUrl(localizeConfigPath).pipe(first(), map$1((data) => !!data), catchError$1((err) => {
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
    getSavedNotificationStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield Preferences.get({
                key: NotiSessionStorageKeys.KEY_NOTIFICATION_STATUS,
            });
            if (!data || !(data === null || data === void 0 ? void 0 : data.value)) {
                return undefined;
            }
            return (data === null || data === void 0 ? void 0 : data.value) === 'on';
        });
    }
}
NotificationsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: NotificationsService, deps: [{ token: i1$2.Platform }, { token: HttpProvider }, { token: i3.CdsLangService }], target: i0.ɵɵFactoryTarget.Injectable });
NotificationsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: NotificationsService, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: NotificationsService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root',
                }]
        }], ctorParameters: function () { return [{ type: i1$2.Platform }, { type: HttpProvider }, { type: i3.CdsLangService }]; } });

class NgNotificationControllerComponent {
    constructor(cdsBottomSheet, translatePipe, notificationsService, cdsLangService, adobeAnalytics) {
        this.cdsBottomSheet = cdsBottomSheet;
        this.translatePipe = translatePipe;
        this.notificationsService = notificationsService;
        this.cdsLangService = cdsLangService;
        this.adobeAnalytics = adobeAnalytics;
        /**
         * Emit the event in case user tap to the toggle only (does not apply for another cases)
         */
        this.onToggle = new EventEmitter();
        this.appNotificationsStatus = false;
        this.pushnotificationsControl = new FormControl(this.appNotificationsStatus);
        this.pushNotificationsFeatureEnabled = false;
        this.notificationLineItem = '';
        this.ignorePushNotiChange = false;
        this.initNotiSwitchInit = false;
        this.sessionCleaned$ = new Subject();
    }
    ngOnInit() {
        this.notificationsService.loadLocalizationSub().subscribe((success) => {
            if (success) {
                this.pushNotificationsFeatureEnabled = true;
                this.initNotiSwitch();
            }
            console.log('==>noti controller load lz success :>> ', success);
        });
        this.notificationsService.loadLocalization();
        App.addListener('resume', () => {
            console.log('==>App Resume.');
            this.checkNotiStatus(true);
        });
    }
    checkNotiStatus(trackAnalytic = false) {
        this.getNotificationsStatus()
            .pipe(map$1(({ enabled }) => enabled))
            .subscribe((turnedOn) => {
            console.log('==>checkNotiStatus:>> ', turnedOn);
            if (turnedOn !== this.pushnotificationsControl.value) {
                this.ignorePushNotiChange = true;
                this.pushnotificationsControl.setValue(turnedOn);
            }
            if (trackAnalytic) {
                this.notificationsService
                    .getSavedNotificationStatus()
                    .then((previousStatus) => {
                    console.log('==>previousStatus :>> ', previousStatus);
                    if (previousStatus === undefined || previousStatus === turnedOn) {
                        return;
                    }
                    // track in case the notification setting was changed
                    this.trackNotificationStatusChanged(turnedOn);
                });
            }
            this.notificationsService.saveNotificationStatus(turnedOn);
            this.appNotificationsStatus = turnedOn;
        });
    }
    initNotiSwitch() {
        this.notificationLineItem = this.translatePipe.transform('notifications_line_item');
        this.cdsLangService.currentLanguageObservable
            .pipe(map$1((lang) => {
            this.notificationLineItem = this.translatePipe.transform('notifications_line_item');
        }))
            .subscribe();
        if (this.initNotiSwitchInit) {
            return;
        }
        this.initNotiSwitchInit = true;
        this.pushnotificationsControl.valueChanges
            .pipe(distinctUntilChanged(), switchMap((enable) => {
            if (this.ignorePushNotiChange) {
                this.ignorePushNotiChange = false;
                return of({ enabled: null, sendUpdate: false });
            }
            if (enable) {
                return this.turnOnNotifications().pipe(take(1), map$1((enabled) => ({ enabled, sendUpdate: !enabled })), catchError$1((error) => {
                    return of({ enabled: false, sendUpdate: true });
                }));
            }
            else {
                return this.turnOffNotifications().pipe(take(1), map$1((disabled) => ({
                    enabled: !disabled,
                    sendUpdate: !disabled,
                })), catchError$1((error) => {
                    return of({ enabled: true, sendUpdate: true });
                }));
            }
        }))
            .subscribe(({ enabled, sendUpdate }) => {
            if (enabled !== null && sendUpdate) {
                this.ignorePushNotiChange = true;
                this.pushnotificationsControl.setValue(enabled);
                this.appNotificationsStatus = enabled;
            }
        });
        this.checkNotiStatus(true);
    }
    /**
     * return true if notification was turned on
     */
    turnOnNotifications() {
        const sheet = this.cdsBottomSheet.open(TurnOnNotificationsSheet, {
            disableClose: true,
            showHandleBar: false,
        });
        this.sessionCleaned$.pipe(take(1)).subscribe(() => {
            this.closeSheet(sheet);
        });
        return sheet.instance.isProceed.pipe(take(1), switchMap((isProceed) => {
            this.emitToggleValues(TOGGLE_TYPE.TURN_ON, isProceed);
            if (isProceed) {
                return this.startTurnOnNotifications().pipe(map$1((success) => success), catchError$1(() => {
                    return of(false);
                }));
            }
            else {
                return of(false);
            }
        }), finalize(() => {
            sheet.dismiss();
        }));
    }
    /**
     * return true if notification was turned on
     */
    startTurnOnNotifications() {
        return new Observable((observer) => {
            Notifications.openNotificationsSetting().then((notificationStatus) => {
                observer.next(notificationStatus.enabled);
            });
        });
    }
    /**
     * return true if notification was turned off
     */
    turnOffNotifications() {
        const sheet = this.cdsBottomSheet.open(TurnOffNotificationsSheet, {
            disableClose: true,
            showHandleBar: false,
        });
        this.sessionCleaned$.pipe(take(1)).subscribe(() => {
            this.closeSheet(sheet);
        });
        return sheet.instance.isProceed.pipe(take(1), switchMap((isProceed) => {
            this.emitToggleValues(TOGGLE_TYPE.TURN_OFF, isProceed);
            if (isProceed) {
                return this.startTurnOffNotifications().pipe(map$1((success) => success), catchError$1(() => {
                    return of(false);
                }));
            }
            else {
                return of(false);
            }
        }), finalize(() => {
            sheet.dismiss();
        }));
    }
    /**
     * return true if notification was turned off
     */
    startTurnOffNotifications() {
        return new Observable((observer) => {
            Notifications.openNotificationsSetting().then((notificationStatus) => {
                observer.next(!notificationStatus.enabled);
            });
        });
    }
    getNotificationsStatus() {
        return new Observable((observer) => {
            Notifications.getNotificationsStatus().then((notificationStatus) => {
                observer.next({ enabled: notificationStatus.enabled });
            });
        });
    }
    closeSheet(sheet) {
        if (sheet) {
            sheet.dismiss();
        }
    }
    /**
     *
     * @param type
     * @param isProceed
     * @returns {
          type: turn_on/turn_off,
          isProceed: true/false (ok/cancel),
          actionName: The cta button label
     */
    emitToggleValues(type, isProceed) {
        if (isProceed) {
            this.smockDataForTesting(type);
        }
        // TODO: remove the following logic since the EDDL will be handled inside the lib, so don't need to expose the event
        if (type === TOGGLE_TYPE.TURN_OFF) {
            this.onToggle.emit({
                type: type,
                isProceed: isProceed,
                actionName: isProceed
                    ? this.translatePipe.transform('notifications_turn_off_cta2')
                    : this.translatePipe.transform('notifications_turn_off_cta1'),
            });
        }
        if (type === TOGGLE_TYPE.TURN_ON) {
            this.onToggle.emit({
                type: type,
                isProceed: isProceed,
                actionName: isProceed
                    ? this.translatePipe.transform('notifications_turn_on_cta2')
                    : this.translatePipe.transform('notifications_turn_on_cta1'),
            });
        }
    }
    trackNotificationStatusChanged(status) {
        const EVENT = 'toggleChange';
        const eventInfo = {
            event: EVENT,
            eventInfo: {
                toggle: {
                    name: 'Notification',
                    value: status ? 'On' : 'Off',
                },
            },
        };
        this.adobeAnalytics.trackEvent(EVENT, eventInfo);
        console.log('==>trackNotificationStatusChanged :>> ', JSON.stringify(eventInfo));
    }
    /**
     * This is native feature, just provide the analytic tracking for adobeDataLayer debug on web
     */
    smockDataForTesting(type) {
        if (Capacitor.isNativePlatform()) {
            return;
        }
        this.trackNotificationStatusChanged(type === TOGGLE_TYPE.TURN_ON);
    }
}
NgNotificationControllerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: NgNotificationControllerComponent, deps: [{ token: i1.CdsBottomSheetService }, { token: i3.CdsLangPipe }, { token: NotificationsService }, { token: i3.CdsLangService }, { token: i2$1.AdobeAnalyticsService }], target: i0.ɵɵFactoryTarget.Component });
NgNotificationControllerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.10", type: NgNotificationControllerComponent, selector: "ng-notification-controller", inputs: { config: "config" }, outputs: { onToggle: "onToggle" }, ngImport: i0, template: "<cds-switch\n  [formControl]=\"pushnotificationsControl\"\n  [config]=\"{\n    label: notificationLineItem,\n    value: appNotificationsStatus\n  }\"\n  *ngIf=\"pushNotificationsFeatureEnabled\"\n  id=\"notifications_line_item\"\n></cds-switch>\n", styles: [""], dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i6.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: NgNotificationControllerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ng-notification-controller', template: "<cds-switch\n  [formControl]=\"pushnotificationsControl\"\n  [config]=\"{\n    label: notificationLineItem,\n    value: appNotificationsStatus\n  }\"\n  *ngIf=\"pushNotificationsFeatureEnabled\"\n  id=\"notifications_line_item\"\n></cds-switch>\n" }]
        }], ctorParameters: function () { return [{ type: i1.CdsBottomSheetService }, { type: i3.CdsLangPipe }, { type: NotificationsService }, { type: i3.CdsLangService }, { type: i2$1.AdobeAnalyticsService }]; }, propDecorators: { config: [{
                type: Input
            }], onToggle: [{
                type: Output
            }] } });

class NgNotificationControllerModule {
}
NgNotificationControllerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: NgNotificationControllerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgNotificationControllerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.10", ngImport: i0, type: NgNotificationControllerModule, declarations: [NgNotificationControllerComponent], imports: [CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        CdsLanguageModule,
        CdsBottomSheetModule,
        CdsIonTopBarModule,
        CdsButtonModule,
        CdsIconModule,
        CdsPopupModule,
        MLCaptionModule,
        TurnOnNotificationsSheetModule,
        TurnOffNotificationsSheetModule,
        CdsIonSwitchModule], exports: [NgNotificationControllerComponent] });
NgNotificationControllerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: NgNotificationControllerModule, imports: [CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        CdsLanguageModule,
        CdsBottomSheetModule,
        CdsIonTopBarModule,
        CdsButtonModule,
        CdsIconModule,
        CdsPopupModule,
        MLCaptionModule,
        TurnOnNotificationsSheetModule,
        TurnOffNotificationsSheetModule,
        CdsIonSwitchModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: NgNotificationControllerModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [NgNotificationControllerComponent],
                    imports: [
                        CommonModule,
                        ReactiveFormsModule,
                        MatDialogModule,
                        CdsLanguageModule,
                        CdsBottomSheetModule,
                        CdsIonTopBarModule,
                        CdsButtonModule,
                        CdsIconModule,
                        CdsPopupModule,
                        MLCaptionModule,
                        TurnOnNotificationsSheetModule,
                        TurnOffNotificationsSheetModule,
                        CdsIonSwitchModule
                    ],
                    schemas: [CUSTOM_ELEMENTS_SCHEMA],
                    exports: [NgNotificationControllerComponent]
                }]
        }] });

class NotiConfigurations {
}

class NotiApi {
    constructor() {
        this.uri = '';
        this.version = '';
        this.endpoint = '';
    }
}

/*
 * Public API Surface of ng-notification-controller
 */
/**
 * Caption Components
 */

/**
 * Generated bundle index. Do not edit.
 */

export { HttpProvider, MLCaptionComponent, MLCaptionModule, MOBILE_APP_HTTP_ORIGIN, NgNotificationControllerComponent, NgNotificationControllerModule, NotiApi, NotiConfigurations, NotificationEvent, NotificationsService, TOGGLE_TYPE, TurnOffNotificationsSheet, TurnOffNotificationsSheetModule, TurnOnNotificationsSheet, TurnOnNotificationsSheetModule };
//# sourceMappingURL=reg-ng-notification-controller.mjs.map
