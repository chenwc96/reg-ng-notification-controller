import { EventEmitter, OnInit } from '@angular/core';
import { AdobeAnalyticsService } from '@cds/ng-adobe-analytics';
import { CdsLangService } from '@cds/ng-core/lang';
import { CdsBottomSheetRef } from '@cds/ng-ionic-components/bottom-sheet';
import * as i0 from "@angular/core";
export declare class TurnOnNotificationsSheet implements OnInit {
    private sheetRef;
    private adobeAnalytics;
    private cdsLangService;
    isProceed: EventEmitter<boolean>;
    constructor(sheetRef: CdsBottomSheetRef<TurnOnNotificationsSheet>, adobeAnalytics: AdobeAnalyticsService, cdsLangService: CdsLangService);
    ngOnInit(): void;
    cancel(): void;
    proceed(): void;
    private getTranslation;
    static ɵfac: i0.ɵɵFactoryDeclaration<TurnOnNotificationsSheet, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TurnOnNotificationsSheet, "lib-turn-on-notifications", never, {}, { "isProceed": "isProceed"; }, never, never, false, never>;
}
