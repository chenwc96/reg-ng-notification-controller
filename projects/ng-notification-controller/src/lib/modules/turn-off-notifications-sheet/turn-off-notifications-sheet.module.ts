import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CdsLangPipe } from '@cds/ng-core/lang';
import { CdsButtonModule } from '@cds/ng-web-components/button';

import { TurnOffNotificationsSheet } from './turn-off-notifications-sheet.component';
import { MLCaptionModule } from '../caption/caption.module';

@NgModule({
  imports: [CommonModule, MLCaptionModule, CdsButtonModule],
  declarations: [TurnOffNotificationsSheet],
  exports: [TurnOffNotificationsSheet],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [CdsLangPipe]
})
export class TurnOffNotificationsSheetModule {}
