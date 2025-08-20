import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CdsLangPipe } from '@cds/ng-core/lang';

import { MLCaptionComponent } from './caption.component';

@NgModule({
  imports: [CommonModule],
  declarations: [MLCaptionComponent],
  exports: [MLCaptionComponent],
  providers: [CdsLangPipe]
})
export class MLCaptionModule {}
