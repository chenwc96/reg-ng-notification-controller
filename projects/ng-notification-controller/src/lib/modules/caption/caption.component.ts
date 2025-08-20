import { Component, HostBinding, Input } from '@angular/core';
import { CdsLangPipe } from '@cds/ng-core/lang';

@Component({
  selector: 'ml-caption',
  templateUrl: './caption.component.html',
  styleUrls: ['./caption.component.scss']
})
export class MLCaptionComponent {
  readonly REPLACE_PARAM = '{mli-param}';
  @Input() uiCaptionParam: string = '';
  @Input() fieldId: any;

  /**
   * Provides string value from fieldId input and provides translation based on current language.
   * Replaces {mli-param} parameter from .json field with uiCaptionParam value.
   * @returns {string} String value of fieldId.
   */
  get caption(): string {
    if (typeof this.fieldId == 'string') {
      let text = this.translatePipe.transform(this.fieldId);
      text = text.replace(this.REPLACE_PARAM, this.uiCaptionParam || '');
      return text;
    }
    return this.fieldId;
  }

  constructor(public translatePipe: CdsLangPipe) {}

  @HostBinding('attr.id') id: string = '';
}
