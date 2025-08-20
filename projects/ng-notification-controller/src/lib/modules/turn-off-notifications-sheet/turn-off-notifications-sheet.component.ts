import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AdobeAnalyticsService } from '@cds/ng-adobe-analytics';
import { CdsLangService } from '@cds/ng-core/lang';
import { CdsBottomSheetRef } from '@cds/ng-ionic-components/bottom-sheet';

@Component({
  selector: 'lib-turn-off-notifications',
  templateUrl: './turn-off-notifications-sheet.component.html',
  styleUrls: ['./turn-off-notifications-sheet.component.css'],
})
export class TurnOffNotificationsSheet implements OnInit {
  @Output() isProceed = new EventEmitter<boolean>();

  constructor(
    private sheetRef: CdsBottomSheetRef<TurnOffNotificationsSheet>,
    private adobeAnalytics: AdobeAnalyticsService,
    private cdsLangService: CdsLangService
  ) {}

  ngOnInit(): void {
    this.adobeAnalytics.trackCommonEvent('popUpDisplay', {
      title:
        this.getTranslation('notifications_turn_off_popup_title') ??
        'Turn off notifications',
    });
  }

  cancel() {
    this.adobeAnalytics.trackCommonEvent('buttonClick', {
      label: this.getTranslation('notifications_turn_off_cta1') ?? 'Not now',
    });
    this.isProceed.emit(false);
    this.sheetRef.dismiss();
  }

  proceed() {
    this.adobeAnalytics.trackCommonEvent('buttonClick', {
      label: this.getTranslation('notifications_turn_off_cta2') ?? 'Turn off',
    });
    this.isProceed.emit(true);
    this.sheetRef.dismiss();
  }

  private getTranslation(key: string): string {
    const entries = this.cdsLangService.getLangEntriesById(key);
    return entries ? entries['en'] : null;
  }
}
