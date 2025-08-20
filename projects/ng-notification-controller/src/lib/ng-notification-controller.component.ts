import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { App } from '@capacitor/app';
import { CdsLangPipe, CdsLangService } from '@cds/ng-core/lang';
import {
  CdsBottomSheetRef,
  CdsBottomSheetService,
} from '@cds/ng-ionic-components/bottom-sheet';
import {
  Observable,
  Subject,
  catchError,
  distinctUntilChanged,
  finalize,
  map,
  of,
  switchMap,
  take,
} from 'rxjs';

import { Notifications } from '@reg/ng-notification-plugin';
import { NotiConfigurations } from './config/configurations';
import { TOGGLE_TYPE } from './const/notifications-const';
import { TurnOffNotificationsSheet } from './modules/turn-off-notifications-sheet/turn-off-notifications-sheet.component';
import { TurnOnNotificationsSheet } from './modules/turn-on-notifications-sheet/turn-on-notifications-sheet.component';
import { NotificationsService } from './ng-notification-controller.service';
import { AdobeAnalyticsService } from '@cds/ng-adobe-analytics';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'ng-notification-controller',
  templateUrl: './ng-notification-controller.component.html',
  styleUrls: ['./ng-notification-controller.component.css'],
})
export class NgNotificationControllerComponent implements OnInit {
  @Input() config: NotiConfigurations;
  /**
   * Emit the event in case user tap to the toggle only (does not apply for another cases)
   */
  @Output() onToggle: EventEmitter<any> = new EventEmitter();
  appNotificationsStatus = false;
  pushnotificationsControl = new FormControl(this.appNotificationsStatus);
  pushNotificationsFeatureEnabled = false;
  notificationLineItem = '';
  private ignorePushNotiChange = false;
  private initNotiSwitchInit = false;

  private sessionCleaned$ = new Subject();

  constructor(
    private cdsBottomSheet: CdsBottomSheetService,
    public translatePipe: CdsLangPipe,
    private notificationsService: NotificationsService,
    private cdsLangService: CdsLangService,
    private adobeAnalytics: AdobeAnalyticsService
  ) {}

  ngOnInit(): void {
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

  private checkNotiStatus(trackAnalytic: boolean = false) {
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

  private initNotiSwitch() {
    this.notificationLineItem = this.translatePipe.transform(
      'notifications_line_item'
    );
    this.cdsLangService.currentLanguageObservable
      .pipe(
        map((lang) => {
          this.notificationLineItem = this.translatePipe.transform(
            'notifications_line_item'
          );
        })
      )
      .subscribe();
    if (this.initNotiSwitchInit) {
      return;
    }
    this.initNotiSwitchInit = true;
    this.pushnotificationsControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        switchMap(
          (enable): Observable<{ enabled: any; sendUpdate: boolean }> => {
            if (this.ignorePushNotiChange) {
              this.ignorePushNotiChange = false;
              return of({ enabled: null, sendUpdate: false });
            }
            if (enable) {
              return this.turnOnNotifications().pipe(
                take(1),
                map((enabled) => ({ enabled, sendUpdate: !enabled })),
                catchError((error) => {
                  return of({ enabled: false, sendUpdate: true });
                })
              );
            } else {
              return this.turnOffNotifications().pipe(
                take(1),
                map((disabled) => ({
                  enabled: !disabled,
                  sendUpdate: !disabled,
                })),
                catchError((error) => {
                  return of({ enabled: true, sendUpdate: true });
                })
              );
            }
          }
        )
      )
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
  turnOnNotifications(): Observable<boolean> {
    const sheet = this.cdsBottomSheet.open(TurnOnNotificationsSheet, {
      disableClose: true,
      showHandleBar: false,
    });

    this.sessionCleaned$.pipe(take(1)).subscribe(() => {
      this.closeSheet(sheet);
    });

    return sheet.instance.isProceed.pipe(
      take(1),
      switchMap((isProceed) => {
        this.emitToggleValues(TOGGLE_TYPE.TURN_ON, isProceed);
        if (isProceed) {
          return this.startTurnOnNotifications().pipe(
            map((success) => success),
            catchError(() => {
              return of(false);
            })
          );
        } else {
          return of(false);
        }
      }),
      finalize(() => {
        sheet.dismiss();
      })
    );
  }

  /**
   * return true if notification was turned on
   */
  private startTurnOnNotifications(): Observable<boolean> {
    return new Observable((observer) => {
      Notifications.openNotificationsSetting().then((notificationStatus) => {
        observer.next(notificationStatus.enabled);
      });
    });
  }

  /**
   * return true if notification was turned off
   */
  turnOffNotifications(): Observable<boolean> {
    const sheet = this.cdsBottomSheet.open(TurnOffNotificationsSheet, {
      disableClose: true,
      showHandleBar: false,
    });

    this.sessionCleaned$.pipe(take(1)).subscribe(() => {
      this.closeSheet(sheet);
    });

    return sheet.instance.isProceed.pipe(
      take(1),
      switchMap((isProceed) => {
        this.emitToggleValues(TOGGLE_TYPE.TURN_OFF, isProceed);
        if (isProceed) {
          return this.startTurnOffNotifications().pipe(
            map((success) => success),
            catchError(() => {
              return of(false);
            })
          );
        } else {
          return of(false);
        }
      }),
      finalize(() => {
        sheet.dismiss();
      })
    );
  }

  /**
   * return true if notification was turned off
   */
  private startTurnOffNotifications(): Observable<boolean> {
    return new Observable((observer) => {
      Notifications.openNotificationsSetting().then((notificationStatus) => {
        observer.next(!notificationStatus.enabled);
      });
    });
  }

  getNotificationsStatus(): Observable<{ enabled: boolean }> {
    return new Observable((observer) => {
      Notifications.getNotificationsStatus().then((notificationStatus) => {
        observer.next({ enabled: notificationStatus.enabled });
      });
    });
  }

  closeSheet(sheet?: CdsBottomSheetRef) {
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
  private emitToggleValues(type: string, isProceed: boolean) {
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

  private trackNotificationStatusChanged(status: boolean) {
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
    console.log(
      '==>trackNotificationStatusChanged :>> ',
      JSON.stringify(eventInfo)
    );
  }

  /**
   * This is native feature, just provide the analytic tracking for adobeDataLayer debug on web
   */
  private smockDataForTesting(type: string) {
    if (Capacitor.isNativePlatform()) {
      return;
    }
    this.trackNotificationStatusChanged(type === TOGGLE_TYPE.TURN_ON);
  }
}
