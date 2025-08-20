import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CdsLangPipe } from '@cds/ng-core/lang';
import { CdsButtonModule } from '@cds/ng-web-components/button';

import { TurnOnNotificationsSheet } from './turn-on-notifications-sheet.component';
import { MLCaptionModule } from '../caption/caption.module';

@NgModule({
  imports: [CommonModule, MLCaptionModule, CdsButtonModule],
  declarations: [TurnOnNotificationsSheet],
  exports: [TurnOnNotificationsSheet],
  providers: [CdsLangPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TurnOnNotificationsSheetModule {}
