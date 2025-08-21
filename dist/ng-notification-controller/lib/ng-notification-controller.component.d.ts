import { EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CdsLangPipe, CdsLangService } from '@cds/ng-core/lang';
import { CdsBottomSheetRef, CdsBottomSheetService } from '@cds/ng-ionic-components/bottom-sheet';
import { Observable } from 'rxjs';
import { NotiConfigurations } from './config/configurations';
import { NotificationsService } from './ng-notification-controller.service';
import { AdobeAnalyticsService } from '@cds/ng-adobe-analytics';
import * as i0 from "@angular/core";
export declare class NgNotificationControllerComponent implements OnInit {
    private cdsBottomSheet;
    translatePipe: CdsLangPipe;
    private notificationsService;
    private cdsLangService;
    private adobeAnalytics;
    config: NotiConfigurations;
    /**
     * Emit the event in case user tap to the toggle only (does not apply for another cases)
     */
    onToggle: EventEmitter<any>;
    appNotificationsStatus: boolean;
    pushnotificationsControl: FormControl<boolean>;
    pushNotificationsFeatureEnabled: boolean;
    notificationLineItem: string;
    private ignorePushNotiChange;
    private initNotiSwitchInit;
    private sessionCleaned$;
    constructor(cdsBottomSheet: CdsBottomSheetService, translatePipe: CdsLangPipe, notificationsService: NotificationsService, cdsLangService: CdsLangService, adobeAnalytics: AdobeAnalyticsService);
    ngOnInit(): void;
    private checkNotiStatus;
    private initNotiSwitch;
    /**
     * return true if notification was turned on
     */
    turnOnNotifications(): Observable<boolean>;
    /**
     * return true if notification was turned on
     */
    private startTurnOnNotifications;
    /**
     * return true if notification was turned off
     */
    turnOffNotifications(): Observable<boolean>;
    /**
     * return true if notification was turned off
     */
    private startTurnOffNotifications;
    getNotificationsStatus(): Observable<{
        enabled: boolean;
    }>;
    closeSheet(sheet?: CdsBottomSheetRef): void;
    /**
     *
     * @param type
     * @param isProceed
     * @returns {
          type: turn_on/turn_off,
          isProceed: true/false (ok/cancel),
          actionName: The cta button label
     */
    private emitToggleValues;
    private trackNotificationStatusChanged;
    /**
     * This is native feature, just provide the analytic tracking for adobeDataLayer debug on web
     */
    private smockDataForTesting;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgNotificationControllerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NgNotificationControllerComponent, "ng-notification-controller", never, { "config": "config"; }, { "onToggle": "onToggle"; }, never, never, false, never>;
}
