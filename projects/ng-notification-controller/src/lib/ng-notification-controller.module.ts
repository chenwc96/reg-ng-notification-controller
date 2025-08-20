import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgNotificationControllerComponent } from './ng-notification-controller.component';
import { MLCaptionModule } from './modules/caption/caption.module';
import { TurnOnNotificationsSheetModule } from './modules/turn-on-notifications-sheet/turn-on-notifications-sheet.module';
import { TurnOffNotificationsSheetModule } from './modules/turn-off-notifications-sheet/turn-off-notifications-sheet.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { CdsLanguageModule } from '@cds/ng-core/lang';
import { CdsBottomSheetModule } from '@cds/ng-ionic-components/bottom-sheet';
import { CdsIonSwitchModule } from '@cds/ng-ionic-components/switch';
import { CdsIonTopBarModule } from '@cds/ng-ionic-components/top-bar';
import { CdsButtonModule } from '@cds/ng-web-components/button';
import { CdsIconModule } from '@cds/ng-web-components/icon';
import { CdsPopupModule } from '@cds/ng-web-components/popup';

@NgModule({
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
})


export class NgNotificationControllerModule {}
