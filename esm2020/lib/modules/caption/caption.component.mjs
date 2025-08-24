import { Component, HostBinding, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@cds/ng-core/lang";
import * as i2 from "@angular/common";
export class MLCaptionComponent {
    /**
     * Provides string value from fieldId input and provides translation based on current language.
     * Replaces {mli-param} parameter from .json field with uiCaptionParam value.
     * @returns {string} String value of fieldId.
     */
    get caption() {
        if (typeof this.fieldId == 'string') {
            let text = this.translatePipe.transform(this.fieldId);
            text = text.replace(this.REPLACE_PARAM, this.uiCaptionParam || '');
            return text;
        }
        return this.fieldId;
    }
    constructor(translatePipe) {
        this.translatePipe = translatePipe;
        this.REPLACE_PARAM = '{mli-param}';
        this.uiCaptionParam = '';
        this.id = '';
    }
}
MLCaptionComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: MLCaptionComponent, deps: [{ token: i1.CdsLangPipe }], target: i0.ɵɵFactoryTarget.Component });
MLCaptionComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.2.10", type: MLCaptionComponent, selector: "ml-caption", inputs: { uiCaptionParam: "uiCaptionParam", fieldId: "fieldId" }, host: { properties: { "attr.id": "this.id" } }, ngImport: i0, template: "<p *ngIf=\"caption\" [innerHTML]=\"caption\"></p>\n", styles: [":host>p{display:initial}\n"], dependencies: [{ kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: MLCaptionComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ml-caption', template: "<p *ngIf=\"caption\" [innerHTML]=\"caption\"></p>\n", styles: [":host>p{display:initial}\n"] }]
        }], ctorParameters: function () { return [{ type: i1.CdsLangPipe }]; }, propDecorators: { uiCaptionParam: [{
                type: Input
            }], fieldId: [{
                type: Input
            }], id: [{
                type: HostBinding,
                args: ['attr.id']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FwdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy1ub3RpZmljYXRpb24tY29udHJvbGxlci9zcmMvbGliL21vZHVsZXMvY2FwdGlvbi9jYXB0aW9uLmNvbXBvbmVudC50cyIsIi4uLy4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL25nLW5vdGlmaWNhdGlvbi1jb250cm9sbGVyL3NyYy9saWIvbW9kdWxlcy9jYXB0aW9uL2NhcHRpb24uY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBUTlELE1BQU0sT0FBTyxrQkFBa0I7SUFLN0I7Ozs7T0FJRztJQUNILElBQUksT0FBTztRQUNULElBQUksT0FBTyxJQUFJLENBQUMsT0FBTyxJQUFJLFFBQVEsRUFBRTtZQUNuQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEQsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsY0FBYyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ25FLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDdEIsQ0FBQztJQUVELFlBQW1CLGFBQTBCO1FBQTFCLGtCQUFhLEdBQWIsYUFBYSxDQUFhO1FBbEJwQyxrQkFBYSxHQUFHLGFBQWEsQ0FBQztRQUM5QixtQkFBYyxHQUFXLEVBQUUsQ0FBQztRQW1CYixPQUFFLEdBQVcsRUFBRSxDQUFDO0lBRlEsQ0FBQzs7Z0hBbkJ0QyxrQkFBa0I7b0dBQWxCLGtCQUFrQixvS0NSL0IscURBQ0E7NEZET2Esa0JBQWtCO2tCQUw5QixTQUFTOytCQUNFLFlBQVk7a0dBTWIsY0FBYztzQkFBdEIsS0FBSztnQkFDRyxPQUFPO3NCQUFmLEtBQUs7Z0JBa0JrQixFQUFFO3NCQUF6QixXQUFXO3VCQUFDLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEhvc3RCaW5kaW5nLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2RzTGFuZ1BpcGUgfSBmcm9tICdAY2RzL25nLWNvcmUvbGFuZyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ21sLWNhcHRpb24nLFxuICB0ZW1wbGF0ZVVybDogJy4vY2FwdGlvbi5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2NhcHRpb24uY29tcG9uZW50LnNjc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBNTENhcHRpb25Db21wb25lbnQge1xuICByZWFkb25seSBSRVBMQUNFX1BBUkFNID0gJ3ttbGktcGFyYW19JztcbiAgQElucHV0KCkgdWlDYXB0aW9uUGFyYW06IHN0cmluZyA9ICcnO1xuICBASW5wdXQoKSBmaWVsZElkOiBhbnk7XG5cbiAgLyoqXG4gICAqIFByb3ZpZGVzIHN0cmluZyB2YWx1ZSBmcm9tIGZpZWxkSWQgaW5wdXQgYW5kIHByb3ZpZGVzIHRyYW5zbGF0aW9uIGJhc2VkIG9uIGN1cnJlbnQgbGFuZ3VhZ2UuXG4gICAqIFJlcGxhY2VzIHttbGktcGFyYW19IHBhcmFtZXRlciBmcm9tIC5qc29uIGZpZWxkIHdpdGggdWlDYXB0aW9uUGFyYW0gdmFsdWUuXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9IFN0cmluZyB2YWx1ZSBvZiBmaWVsZElkLlxuICAgKi9cbiAgZ2V0IGNhcHRpb24oKTogc3RyaW5nIHtcbiAgICBpZiAodHlwZW9mIHRoaXMuZmllbGRJZCA9PSAnc3RyaW5nJykge1xuICAgICAgbGV0IHRleHQgPSB0aGlzLnRyYW5zbGF0ZVBpcGUudHJhbnNmb3JtKHRoaXMuZmllbGRJZCk7XG4gICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKHRoaXMuUkVQTEFDRV9QQVJBTSwgdGhpcy51aUNhcHRpb25QYXJhbSB8fCAnJyk7XG4gICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZmllbGRJZDtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0cmFuc2xhdGVQaXBlOiBDZHNMYW5nUGlwZSkge31cblxuICBASG9zdEJpbmRpbmcoJ2F0dHIuaWQnKSBpZDogc3RyaW5nID0gJyc7XG59XG4iLCI8cCAqbmdJZj1cImNhcHRpb25cIiBbaW5uZXJIVE1MXT1cImNhcHRpb25cIj48L3A+XG4iXX0=