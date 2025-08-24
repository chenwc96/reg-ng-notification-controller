import { CdsLangPipe } from '@cds/ng-core/lang';
import * as i0 from "@angular/core";
export declare class MLCaptionComponent {
    translatePipe: CdsLangPipe;
    readonly REPLACE_PARAM = "{mli-param}";
    uiCaptionParam: string;
    fieldId: any;
    /**
     * Provides string value from fieldId input and provides translation based on current language.
     * Replaces {mli-param} parameter from .json field with uiCaptionParam value.
     * @returns {string} String value of fieldId.
     */
    get caption(): string;
    constructor(translatePipe: CdsLangPipe);
    id: string;
    static ɵfac: i0.ɵɵFactoryDeclaration<MLCaptionComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MLCaptionComponent, "ml-caption", never, { "uiCaptionParam": "uiCaptionParam"; "fieldId": "fieldId"; }, {}, never, never, false, never>;
}
