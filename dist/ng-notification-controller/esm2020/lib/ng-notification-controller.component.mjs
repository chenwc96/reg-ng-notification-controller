import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { App } from '@capacitor/app';
import { Observable, Subject, catchError, distinctUntilChanged, finalize, map, of, switchMap, take, } from 'rxjs';
import { Notifications } from '@reg/ng-notification-plugin';
import { TOGGLE_TYPE } from './const/notifications-const';
import { TurnOffNotificationsSheet } from './modules/turn-off-notifications-sheet/turn-off-notifications-sheet.component';
import { TurnOnNotificationsSheet } from './modules/turn-on-notifications-sheet/turn-on-notifications-sheet.component';
import { Capacitor } from '@capacitor/core';
import * as i0 from "@angular/core";
import * as i1 from "@cds/ng-ionic-components/bottom-sheet";
import * as i2 from "@cds/ng-core/lang";
import * as i3 from "./ng-notification-controller.service";
import * as i4 from "@cds/ng-adobe-analytics";
import * as i5 from "@angular/common";
import * as i6 from "@angular/forms";
export class NgNotificationControllerComponent {
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
            .pipe(map(({ enabled }) => enabled))
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
            .pipe(map((lang) => {
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
                return this.turnOnNotifications().pipe(take(1), map((enabled) => ({ enabled, sendUpdate: !enabled })), catchError((error) => {
                    return of({ enabled: false, sendUpdate: true });
                }));
            }
            else {
                return this.turnOffNotifications().pipe(take(1), map((disabled) => ({
                    enabled: !disabled,
                    sendUpdate: !disabled,
                })), catchError((error) => {
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
                return this.startTurnOnNotifications().pipe(map((success) => success), catchError(() => {
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
                return this.startTurnOffNotifications().pipe(map((success) => success), catchError(() => {
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
NgNotificationControllerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: NgNotificationControllerComponent, deps: [{ token: i1.CdsBottomSheetService }, { token: i2.CdsLangPipe }, { token: i3.NotificationsService }, { token: i2.CdsLangService }, { token: i4.AdobeAnalyticsService }], target: i0.ɵɵFactoryTarget.Component });
NgNotificationControllerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.10", type: NgNotificationControllerComponent, selector: "ng-notification-controller", inputs: { config: "config" }, outputs: { onToggle: "onToggle" }, ngImport: i0, template: "<cds-switch\n  [formControl]=\"pushnotificationsControl\"\n  [config]=\"{\n    label: notificationLineItem,\n    value: appNotificationsStatus\n  }\"\n  *ngIf=\"pushNotificationsFeatureEnabled\"\n  id=\"notifications_line_item\"\n></cds-switch>\n", styles: [""], dependencies: [{ kind: "directive", type: i5.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i6.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i6.FormControlDirective, selector: "[formControl]", inputs: ["formControl", "disabled", "ngModel"], outputs: ["ngModelChange"], exportAs: ["ngForm"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: NgNotificationControllerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ng-notification-controller', template: "<cds-switch\n  [formControl]=\"pushnotificationsControl\"\n  [config]=\"{\n    label: notificationLineItem,\n    value: appNotificationsStatus\n  }\"\n  *ngIf=\"pushNotificationsFeatureEnabled\"\n  id=\"notifications_line_item\"\n></cds-switch>\n" }]
        }], ctorParameters: function () { return [{ type: i1.CdsBottomSheetService }, { type: i2.CdsLangPipe }, { type: i3.NotificationsService }, { type: i2.CdsLangService }, { type: i4.AdobeAnalyticsService }]; }, propDecorators: { config: [{
                type: Input
            }], onToggle: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctbm90aWZpY2F0aW9uLWNvbnRyb2xsZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmctbm90aWZpY2F0aW9uLWNvbnRyb2xsZXIvc3JjL2xpYi9uZy1ub3RpZmljYXRpb24tY29udHJvbGxlci5jb21wb25lbnQudHMiLCIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy1ub3RpZmljYXRpb24tY29udHJvbGxlci9zcmMvbGliL25nLW5vdGlmaWNhdGlvbi1jb250cm9sbGVyLmNvbXBvbmVudC5odG1sIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBVSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDL0UsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzdDLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQU1yQyxPQUFPLEVBQ0wsVUFBVSxFQUNWLE9BQU8sRUFDUCxVQUFVLEVBQ1Ysb0JBQW9CLEVBQ3BCLFFBQVEsRUFDUixHQUFHLEVBQ0gsRUFBRSxFQUNGLFNBQVMsRUFDVCxJQUFJLEdBQ0wsTUFBTSxNQUFNLENBQUM7QUFFZCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFNUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzFELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLCtFQUErRSxDQUFDO0FBQzFILE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDZFQUE2RSxDQUFDO0FBR3ZILE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7Ozs7QUFPNUMsTUFBTSxPQUFPLGlDQUFpQztJQWU1QyxZQUNVLGNBQXFDLEVBQ3RDLGFBQTBCLEVBQ3pCLG9CQUEwQyxFQUMxQyxjQUE4QixFQUM5Qixj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dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1Db250cm9sIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgQXBwIH0gZnJvbSAnQGNhcGFjaXRvci9hcHAnO1xuaW1wb3J0IHsgQ2RzTGFuZ1BpcGUsIENkc0xhbmdTZXJ2aWNlIH0gZnJvbSAnQGNkcy9uZy1jb3JlL2xhbmcnO1xuaW1wb3J0IHtcbiAgQ2RzQm90dG9tU2hlZXRSZWYsXG4gIENkc0JvdHRvbVNoZWV0U2VydmljZSxcbn0gZnJvbSAnQGNkcy9uZy1pb25pYy1jb21wb25lbnRzL2JvdHRvbS1zaGVldCc7XG5pbXBvcnQge1xuICBPYnNlcnZhYmxlLFxuICBTdWJqZWN0LFxuICBjYXRjaEVycm9yLFxuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgZmluYWxpemUsXG4gIG1hcCxcbiAgb2YsXG4gIHN3aXRjaE1hcCxcbiAgdGFrZSxcbn0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE5vdGlmaWNhdGlvbnMgfSBmcm9tICdAcmVnL25nLW5vdGlmaWNhdGlvbi1wbHVnaW4nO1xuaW1wb3J0IHsgTm90aUNvbmZpZ3VyYXRpb25zIH0gZnJvbSAnLi9jb25maWcvY29uZmlndXJhdGlvbnMnO1xuaW1wb3J0IHsgVE9HR0xFX1RZUEUgfSBmcm9tICcuL2NvbnN0L25vdGlmaWNhdGlvbnMtY29uc3QnO1xuaW1wb3J0IHsgVHVybk9mZk5vdGlmaWNhdGlvbnNTaGVldCB9IGZyb20gJy4vbW9kdWxlcy90dXJuLW9mZi1ub3RpZmljYXRpb25zLXNoZWV0L3R1cm4tb2ZmLW5vdGlmaWNhdGlvbnMtc2hlZXQuY29tcG9uZW50JztcbmltcG9ydCB7IFR1cm5Pbk5vdGlmaWNhdGlvbnNTaGVldCB9IGZyb20gJy4vbW9kdWxlcy90dXJuLW9uLW5vdGlmaWNhdGlvbnMtc2hlZXQvdHVybi1vbi1ub3RpZmljYXRpb25zLXNoZWV0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOb3RpZmljYXRpb25zU2VydmljZSB9IGZyb20gJy4vbmctbm90aWZpY2F0aW9uLWNvbnRyb2xsZXIuc2VydmljZSc7XG5pbXBvcnQgeyBBZG9iZUFuYWx5dGljc1NlcnZpY2UgfSBmcm9tICdAY2RzL25nLWFkb2JlLWFuYWx5dGljcyc7XG5pbXBvcnQgeyBDYXBhY2l0b3IgfSBmcm9tICdAY2FwYWNpdG9yL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduZy1ub3RpZmljYXRpb24tY29udHJvbGxlcicsXG4gIHRlbXBsYXRlVXJsOiAnLi9uZy1ub3RpZmljYXRpb24tY29udHJvbGxlci5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL25nLW5vdGlmaWNhdGlvbi1jb250cm9sbGVyLmNvbXBvbmVudC5jc3MnXSxcbn0pXG5leHBvcnQgY2xhc3MgTmdOb3RpZmljYXRpb25Db250cm9sbGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgY29uZmlnOiBOb3RpQ29uZmlndXJhdGlvbnM7XG4gIC8qKlxuICAgKiBFbWl0IHRoZSBldmVudCBpbiBjYXNlIHVzZXIgdGFwIHRvIHRoZSB0b2dnbGUgb25seSAoZG9lcyBub3QgYXBwbHkgZm9yIGFub3RoZXIgY2FzZXMpXG4gICAqL1xuICBAT3V0cHV0KCkgb25Ub2dnbGU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBhcHBOb3RpZmljYXRpb25zU3RhdHVzID0gZmFsc2U7XG4gIHB1c2hub3RpZmljYXRpb25zQ29udHJvbCA9IG5ldyBGb3JtQ29udHJvbCh0aGlzLmFwcE5vdGlmaWNhdGlvbnNTdGF0dXMpO1xuICBwdXNoTm90aWZpY2F0aW9uc0ZlYXR1cmVFbmFibGVkID0gZmFsc2U7XG4gIG5vdGlmaWNhdGlvbkxpbmVJdGVtID0gJyc7XG4gIHByaXZhdGUgaWdub3JlUHVzaE5vdGlDaGFuZ2UgPSBmYWxzZTtcbiAgcHJpdmF0ZSBpbml0Tm90aVN3aXRjaEluaXQgPSBmYWxzZTtcblxuICBwcml2YXRlIHNlc3Npb25DbGVhbmVkJCA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjZHNCb3R0b21TaGVldDogQ2RzQm90dG9tU2hlZXRTZXJ2aWNlLFxuICAgIHB1YmxpYyB0cmFuc2xhdGVQaXBlOiBDZHNMYW5nUGlwZSxcbiAgICBwcml2YXRlIG5vdGlmaWNhdGlvbnNTZXJ2aWNlOiBOb3RpZmljYXRpb25zU2VydmljZSxcbiAgICBwcml2YXRlIGNkc0xhbmdTZXJ2aWNlOiBDZHNMYW5nU2VydmljZSxcbiAgICBwcml2YXRlIGFkb2JlQW5hbHl0aWNzOiBBZG9iZUFuYWx5dGljc1NlcnZpY2VcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMubm90aWZpY2F0aW9uc1NlcnZpY2UubG9hZExvY2FsaXphdGlvblN1YigpLnN1YnNjcmliZSgoc3VjY2VzcykgPT4ge1xuICAgICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgICAgdGhpcy5wdXNoTm90aWZpY2F0aW9uc0ZlYXR1cmVFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pbml0Tm90aVN3aXRjaCgpO1xuICAgICAgfVxuICAgICAgY29uc29sZS5sb2coJz09Pm5vdGkgY29udHJvbGxlciBsb2FkIGx6IHN1Y2Nlc3MgOj4+ICcsIHN1Y2Nlc3MpO1xuICAgIH0pO1xuICAgIHRoaXMubm90aWZpY2F0aW9uc1NlcnZpY2UubG9hZExvY2FsaXphdGlvbigpO1xuICAgIEFwcC5hZGRMaXN0ZW5lcigncmVzdW1lJywgKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coJz09PkFwcCBSZXN1bWUuJyk7XG4gICAgICB0aGlzLmNoZWNrTm90aVN0YXR1cyh0cnVlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tOb3RpU3RhdHVzKHRyYWNrQW5hbHl0aWM6IGJvb2xlYW4gPSBmYWxzZSkge1xuICAgIHRoaXMuZ2V0Tm90aWZpY2F0aW9uc1N0YXR1cygpXG4gICAgICAucGlwZShtYXAoKHsgZW5hYmxlZCB9KSA9PiBlbmFibGVkKSlcbiAgICAgIC5zdWJzY3JpYmUoKHR1cm5lZE9uKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCc9PT5jaGVja05vdGlTdGF0dXM6Pj4gJywgdHVybmVkT24pO1xuICAgICAgICBpZiAodHVybmVkT24gIT09IHRoaXMucHVzaG5vdGlmaWNhdGlvbnNDb250cm9sLnZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5pZ25vcmVQdXNoTm90aUNoYW5nZSA9IHRydWU7XG4gICAgICAgICAgdGhpcy5wdXNobm90aWZpY2F0aW9uc0NvbnRyb2wuc2V0VmFsdWUodHVybmVkT24pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0cmFja0FuYWx5dGljKSB7XG4gICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25zU2VydmljZVxuICAgICAgICAgICAgLmdldFNhdmVkTm90aWZpY2F0aW9uU3RhdHVzKClcbiAgICAgICAgICAgIC50aGVuKChwcmV2aW91c1N0YXR1cykgPT4ge1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZygnPT0+cHJldmlvdXNTdGF0dXMgOj4+ICcsIHByZXZpb3VzU3RhdHVzKTtcbiAgICAgICAgICAgICAgaWYgKHByZXZpb3VzU3RhdHVzID09PSB1bmRlZmluZWQgfHwgcHJldmlvdXNTdGF0dXMgPT09IHR1cm5lZE9uKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIHRyYWNrIGluIGNhc2UgdGhlIG5vdGlmaWNhdGlvbiBzZXR0aW5nIHdhcyBjaGFuZ2VkXG4gICAgICAgICAgICAgIHRoaXMudHJhY2tOb3RpZmljYXRpb25TdGF0dXNDaGFuZ2VkKHR1cm5lZE9uKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubm90aWZpY2F0aW9uc1NlcnZpY2Uuc2F2ZU5vdGlmaWNhdGlvblN0YXR1cyh0dXJuZWRPbik7XG4gICAgICAgIHRoaXMuYXBwTm90aWZpY2F0aW9uc1N0YXR1cyA9IHR1cm5lZE9uO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGluaXROb3RpU3dpdGNoKCkge1xuICAgIHRoaXMubm90aWZpY2F0aW9uTGluZUl0ZW0gPSB0aGlzLnRyYW5zbGF0ZVBpcGUudHJhbnNmb3JtKFxuICAgICAgJ25vdGlmaWNhdGlvbnNfbGluZV9pdGVtJ1xuICAgICk7XG4gICAgdGhpcy5jZHNMYW5nU2VydmljZS5jdXJyZW50TGFuZ3VhZ2VPYnNlcnZhYmxlXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKChsYW5nKSA9PiB7XG4gICAgICAgICAgdGhpcy5ub3RpZmljYXRpb25MaW5lSXRlbSA9IHRoaXMudHJhbnNsYXRlUGlwZS50cmFuc2Zvcm0oXG4gICAgICAgICAgICAnbm90aWZpY2F0aW9uc19saW5lX2l0ZW0nXG4gICAgICAgICAgKTtcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKTtcbiAgICBpZiAodGhpcy5pbml0Tm90aVN3aXRjaEluaXQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5pbml0Tm90aVN3aXRjaEluaXQgPSB0cnVlO1xuICAgIHRoaXMucHVzaG5vdGlmaWNhdGlvbnNDb250cm9sLnZhbHVlQ2hhbmdlc1xuICAgICAgLnBpcGUoXG4gICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksXG4gICAgICAgIHN3aXRjaE1hcChcbiAgICAgICAgICAoZW5hYmxlKTogT2JzZXJ2YWJsZTx7IGVuYWJsZWQ6IGFueTsgc2VuZFVwZGF0ZTogYm9vbGVhbiB9PiA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pZ25vcmVQdXNoTm90aUNoYW5nZSkge1xuICAgICAgICAgICAgICB0aGlzLmlnbm9yZVB1c2hOb3RpQ2hhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBvZih7IGVuYWJsZWQ6IG51bGwsIHNlbmRVcGRhdGU6IGZhbHNlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVuYWJsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gdGhpcy50dXJuT25Ob3RpZmljYXRpb25zKCkucGlwZShcbiAgICAgICAgICAgICAgICB0YWtlKDEpLFxuICAgICAgICAgICAgICAgIG1hcCgoZW5hYmxlZCkgPT4gKHsgZW5hYmxlZCwgc2VuZFVwZGF0ZTogIWVuYWJsZWQgfSkpLFxuICAgICAgICAgICAgICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PiB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gb2YoeyBlbmFibGVkOiBmYWxzZSwgc2VuZFVwZGF0ZTogdHJ1ZSB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudHVybk9mZk5vdGlmaWNhdGlvbnMoKS5waXBlKFxuICAgICAgICAgICAgICAgIHRha2UoMSksXG4gICAgICAgICAgICAgICAgbWFwKChkaXNhYmxlZCkgPT4gKHtcbiAgICAgICAgICAgICAgICAgIGVuYWJsZWQ6ICFkaXNhYmxlZCxcbiAgICAgICAgICAgICAgICAgIHNlbmRVcGRhdGU6ICFkaXNhYmxlZCxcbiAgICAgICAgICAgICAgICB9KSksXG4gICAgICAgICAgICAgICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBvZih7IGVuYWJsZWQ6IHRydWUsIHNlbmRVcGRhdGU6IHRydWUgfSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoKHsgZW5hYmxlZCwgc2VuZFVwZGF0ZSB9KSA9PiB7XG4gICAgICAgIGlmIChlbmFibGVkICE9PSBudWxsICYmIHNlbmRVcGRhdGUpIHtcbiAgICAgICAgICB0aGlzLmlnbm9yZVB1c2hOb3RpQ2hhbmdlID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnB1c2hub3RpZmljYXRpb25zQ29udHJvbC5zZXRWYWx1ZShlbmFibGVkKTtcbiAgICAgICAgICB0aGlzLmFwcE5vdGlmaWNhdGlvbnNTdGF0dXMgPSBlbmFibGVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB0aGlzLmNoZWNrTm90aVN0YXR1cyh0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm4gdHJ1ZSBpZiBub3RpZmljYXRpb24gd2FzIHR1cm5lZCBvblxuICAgKi9cbiAgdHVybk9uTm90aWZpY2F0aW9ucygpOiBPYnNlcnZhYmxlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBzaGVldCA9IHRoaXMuY2RzQm90dG9tU2hlZXQub3BlbihUdXJuT25Ob3RpZmljYXRpb25zU2hlZXQsIHtcbiAgICAgIGRpc2FibGVDbG9zZTogdHJ1ZSxcbiAgICAgIHNob3dIYW5kbGVCYXI6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXNzaW9uQ2xlYW5lZCQucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5jbG9zZVNoZWV0KHNoZWV0KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzaGVldC5pbnN0YW5jZS5pc1Byb2NlZWQucGlwZShcbiAgICAgIHRha2UoMSksXG4gICAgICBzd2l0Y2hNYXAoKGlzUHJvY2VlZCkgPT4ge1xuICAgICAgICB0aGlzLmVtaXRUb2dnbGVWYWx1ZXMoVE9HR0xFX1RZUEUuVFVSTl9PTiwgaXNQcm9jZWVkKTtcbiAgICAgICAgaWYgKGlzUHJvY2VlZCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnN0YXJ0VHVybk9uTm90aWZpY2F0aW9ucygpLnBpcGUoXG4gICAgICAgICAgICBtYXAoKHN1Y2Nlc3MpID0+IHN1Y2Nlc3MpLFxuICAgICAgICAgICAgY2F0Y2hFcnJvcigoKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBvZihmYWxzZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG9mKGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfSksXG4gICAgICBmaW5hbGl6ZSgoKSA9PiB7XG4gICAgICAgIHNoZWV0LmRpc21pc3MoKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm4gdHJ1ZSBpZiBub3RpZmljYXRpb24gd2FzIHR1cm5lZCBvblxuICAgKi9cbiAgcHJpdmF0ZSBzdGFydFR1cm5Pbk5vdGlmaWNhdGlvbnMoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcikgPT4ge1xuICAgICAgTm90aWZpY2F0aW9ucy5vcGVuTm90aWZpY2F0aW9uc1NldHRpbmcoKS50aGVuKChub3RpZmljYXRpb25TdGF0dXMpID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIubmV4dChub3RpZmljYXRpb25TdGF0dXMuZW5hYmxlZCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZXR1cm4gdHJ1ZSBpZiBub3RpZmljYXRpb24gd2FzIHR1cm5lZCBvZmZcbiAgICovXG4gIHR1cm5PZmZOb3RpZmljYXRpb25zKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIGNvbnN0IHNoZWV0ID0gdGhpcy5jZHNCb3R0b21TaGVldC5vcGVuKFR1cm5PZmZOb3RpZmljYXRpb25zU2hlZXQsIHtcbiAgICAgIGRpc2FibGVDbG9zZTogdHJ1ZSxcbiAgICAgIHNob3dIYW5kbGVCYXI6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zZXNzaW9uQ2xlYW5lZCQucGlwZSh0YWtlKDEpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5jbG9zZVNoZWV0KHNoZWV0KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBzaGVldC5pbnN0YW5jZS5pc1Byb2NlZWQucGlwZShcbiAgICAgIHRha2UoMSksXG4gICAgICBzd2l0Y2hNYXAoKGlzUHJvY2VlZCkgPT4ge1xuICAgICAgICB0aGlzLmVtaXRUb2dnbGVWYWx1ZXMoVE9HR0xFX1RZUEUuVFVSTl9PRkYsIGlzUHJvY2VlZCk7XG4gICAgICAgIGlmIChpc1Byb2NlZWQpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5zdGFydFR1cm5PZmZOb3RpZmljYXRpb25zKCkucGlwZShcbiAgICAgICAgICAgIG1hcCgoc3VjY2VzcykgPT4gc3VjY2VzcyksXG4gICAgICAgICAgICBjYXRjaEVycm9yKCgpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIG9mKGZhbHNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gb2YoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9KSxcbiAgICAgIGZpbmFsaXplKCgpID0+IHtcbiAgICAgICAgc2hlZXQuZGlzbWlzcygpO1xuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIHJldHVybiB0cnVlIGlmIG5vdGlmaWNhdGlvbiB3YXMgdHVybmVkIG9mZlxuICAgKi9cbiAgcHJpdmF0ZSBzdGFydFR1cm5PZmZOb3RpZmljYXRpb25zKCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXIpID0+IHtcbiAgICAgIE5vdGlmaWNhdGlvbnMub3Blbk5vdGlmaWNhdGlvbnNTZXR0aW5nKCkudGhlbigobm90aWZpY2F0aW9uU3RhdHVzKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLm5leHQoIW5vdGlmaWNhdGlvblN0YXR1cy5lbmFibGVkKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0Tm90aWZpY2F0aW9uc1N0YXR1cygpOiBPYnNlcnZhYmxlPHsgZW5hYmxlZDogYm9vbGVhbiB9PiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChvYnNlcnZlcikgPT4ge1xuICAgICAgTm90aWZpY2F0aW9ucy5nZXROb3RpZmljYXRpb25zU3RhdHVzKCkudGhlbigobm90aWZpY2F0aW9uU3RhdHVzKSA9PiB7XG4gICAgICAgIG9ic2VydmVyLm5leHQoeyBlbmFibGVkOiBub3RpZmljYXRpb25TdGF0dXMuZW5hYmxlZCB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgY2xvc2VTaGVldChzaGVldD86IENkc0JvdHRvbVNoZWV0UmVmKSB7XG4gICAgaWYgKHNoZWV0KSB7XG4gICAgICBzaGVldC5kaXNtaXNzKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFxuICAgKiBAcGFyYW0gdHlwZSBcbiAgICogQHBhcmFtIGlzUHJvY2VlZCBcbiAgICogQHJldHVybnMge1xuICAgICAgICB0eXBlOiB0dXJuX29uL3R1cm5fb2ZmLFxuICAgICAgICBpc1Byb2NlZWQ6IHRydWUvZmFsc2UgKG9rL2NhbmNlbCksXG4gICAgICAgIGFjdGlvbk5hbWU6IFRoZSBjdGEgYnV0dG9uIGxhYmVsXG4gICAqL1xuICBwcml2YXRlIGVtaXRUb2dnbGVWYWx1ZXModHlwZTogc3RyaW5nLCBpc1Byb2NlZWQ6IGJvb2xlYW4pIHtcbiAgICBpZiAoaXNQcm9jZWVkKSB7XG4gICAgICB0aGlzLnNtb2NrRGF0YUZvclRlc3RpbmcodHlwZSk7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogcmVtb3ZlIHRoZSBmb2xsb3dpbmcgbG9naWMgc2luY2UgdGhlIEVEREwgd2lsbCBiZSBoYW5kbGVkIGluc2lkZSB0aGUgbGliLCBzbyBkb24ndCBuZWVkIHRvIGV4cG9zZSB0aGUgZXZlbnRcbiAgICBpZiAodHlwZSA9PT0gVE9HR0xFX1RZUEUuVFVSTl9PRkYpIHtcbiAgICAgIHRoaXMub25Ub2dnbGUuZW1pdCh7XG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIGlzUHJvY2VlZDogaXNQcm9jZWVkLFxuICAgICAgICBhY3Rpb25OYW1lOiBpc1Byb2NlZWRcbiAgICAgICAgICA/IHRoaXMudHJhbnNsYXRlUGlwZS50cmFuc2Zvcm0oJ25vdGlmaWNhdGlvbnNfdHVybl9vZmZfY3RhMicpXG4gICAgICAgICAgOiB0aGlzLnRyYW5zbGF0ZVBpcGUudHJhbnNmb3JtKCdub3RpZmljYXRpb25zX3R1cm5fb2ZmX2N0YTEnKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAodHlwZSA9PT0gVE9HR0xFX1RZUEUuVFVSTl9PTikge1xuICAgICAgdGhpcy5vblRvZ2dsZS5lbWl0KHtcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgaXNQcm9jZWVkOiBpc1Byb2NlZWQsXG4gICAgICAgIGFjdGlvbk5hbWU6IGlzUHJvY2VlZFxuICAgICAgICAgID8gdGhpcy50cmFuc2xhdGVQaXBlLnRyYW5zZm9ybSgnbm90aWZpY2F0aW9uc190dXJuX29uX2N0YTInKVxuICAgICAgICAgIDogdGhpcy50cmFuc2xhdGVQaXBlLnRyYW5zZm9ybSgnbm90aWZpY2F0aW9uc190dXJuX29uX2N0YTEnKSxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJhY2tOb3RpZmljYXRpb25TdGF0dXNDaGFuZ2VkKHN0YXR1czogYm9vbGVhbikge1xuICAgIGNvbnN0IEVWRU5UID0gJ3RvZ2dsZUNoYW5nZSc7XG4gICAgY29uc3QgZXZlbnRJbmZvID0ge1xuICAgICAgZXZlbnQ6IEVWRU5ULFxuICAgICAgZXZlbnRJbmZvOiB7XG4gICAgICAgIHRvZ2dsZToge1xuICAgICAgICAgIG5hbWU6ICdOb3RpZmljYXRpb24nLFxuICAgICAgICAgIHZhbHVlOiBzdGF0dXMgPyAnT24nIDogJ09mZicsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH07XG4gICAgdGhpcy5hZG9iZUFuYWx5dGljcy50cmFja0V2ZW50KEVWRU5ULCBldmVudEluZm8pO1xuICAgIGNvbnNvbGUubG9nKFxuICAgICAgJz09PnRyYWNrTm90aWZpY2F0aW9uU3RhdHVzQ2hhbmdlZCA6Pj4gJyxcbiAgICAgIEpTT04uc3RyaW5naWZ5KGV2ZW50SW5mbylcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgbmF0aXZlIGZlYXR1cmUsIGp1c3QgcHJvdmlkZSB0aGUgYW5hbHl0aWMgdHJhY2tpbmcgZm9yIGFkb2JlRGF0YUxheWVyIGRlYnVnIG9uIHdlYlxuICAgKi9cbiAgcHJpdmF0ZSBzbW9ja0RhdGFGb3JUZXN0aW5nKHR5cGU6IHN0cmluZykge1xuICAgIGlmIChDYXBhY2l0b3IuaXNOYXRpdmVQbGF0Zm9ybSgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudHJhY2tOb3RpZmljYXRpb25TdGF0dXNDaGFuZ2VkKHR5cGUgPT09IFRPR0dMRV9UWVBFLlRVUk5fT04pO1xuICB9XG59XG4iLCI8Y2RzLXN3aXRjaFxuICBbZm9ybUNvbnRyb2xdPVwicHVzaG5vdGlmaWNhdGlvbnNDb250cm9sXCJcbiAgW2NvbmZpZ109XCJ7XG4gICAgbGFiZWw6IG5vdGlmaWNhdGlvbkxpbmVJdGVtLFxuICAgIHZhbHVlOiBhcHBOb3RpZmljYXRpb25zU3RhdHVzXG4gIH1cIlxuICAqbmdJZj1cInB1c2hOb3RpZmljYXRpb25zRmVhdHVyZUVuYWJsZWRcIlxuICBpZD1cIm5vdGlmaWNhdGlvbnNfbGluZV9pdGVtXCJcbj48L2Nkcy1zd2l0Y2g+XG4iXX0=