import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CdsLangPipe } from '@cds/ng-core/lang';
import { CdsButtonModule } from '@cds/ng-web-components/button';
import { TurnOffNotificationsSheet } from './turn-off-notifications-sheet.component';
import { MLCaptionModule } from '../caption/caption.module';
import * as i0 from "@angular/core";
export class TurnOffNotificationsSheetModule {
}
TurnOffNotificationsSheetModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: TurnOffNotificationsSheetModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TurnOffNotificationsSheetModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.10", ngImport: i0, type: TurnOffNotificationsSheetModule, declarations: [TurnOffNotificationsSheet], imports: [CommonModule, MLCaptionModule, CdsButtonModule], exports: [TurnOffNotificationsSheet] });
TurnOffNotificationsSheetModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: TurnOffNotificationsSheetModule, providers: [CdsLangPipe], imports: [CommonModule, MLCaptionModule, CdsButtonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: TurnOffNotificationsSheetModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, MLCaptionModule, CdsButtonModule],
                    declarations: [TurnOffNotificationsSheet],
                    exports: [TurnOffNotificationsSheet],
                    schemas: [CUSTOM_ELEMENTS_SCHEMA],
                    providers: [CdsLangPipe]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHVybi1vZmYtbm90aWZpY2F0aW9ucy1zaGVldC5tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9uZy1ub3RpZmljYXRpb24tY29udHJvbGxlci9zcmMvbGliL21vZHVsZXMvdHVybi1vZmYtbm90aWZpY2F0aW9ucy1zaGVldC90dXJuLW9mZi1ub3RpZmljYXRpb25zLXNoZWV0Lm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLHNCQUFzQixFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDaEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBRWhFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDBDQUEwQyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQzs7QUFTNUQsTUFBTSxPQUFPLCtCQUErQjs7NkhBQS9CLCtCQUErQjs4SEFBL0IsK0JBQStCLGlCQUwzQix5QkFBeUIsYUFEOUIsWUFBWSxFQUFFLGVBQWUsRUFBRSxlQUFlLGFBRTlDLHlCQUF5Qjs4SEFJeEIsK0JBQStCLGFBRi9CLENBQUMsV0FBVyxDQUFDLFlBSmQsWUFBWSxFQUFFLGVBQWUsRUFBRSxlQUFlOzRGQU03QywrQkFBK0I7a0JBUDNDLFFBQVE7bUJBQUM7b0JBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUM7b0JBQ3pELFlBQVksRUFBRSxDQUFDLHlCQUF5QixDQUFDO29CQUN6QyxPQUFPLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztvQkFDcEMsT0FBTyxFQUFFLENBQUMsc0JBQXNCLENBQUM7b0JBQ2pDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQztpQkFDekIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSwgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENkc0xhbmdQaXBlIH0gZnJvbSAnQGNkcy9uZy1jb3JlL2xhbmcnO1xuaW1wb3J0IHsgQ2RzQnV0dG9uTW9kdWxlIH0gZnJvbSAnQGNkcy9uZy13ZWItY29tcG9uZW50cy9idXR0b24nO1xuXG5pbXBvcnQgeyBUdXJuT2ZmTm90aWZpY2F0aW9uc1NoZWV0IH0gZnJvbSAnLi90dXJuLW9mZi1ub3RpZmljYXRpb25zLXNoZWV0LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBNTENhcHRpb25Nb2R1bGUgfSBmcm9tICcuLi9jYXB0aW9uL2NhcHRpb24ubW9kdWxlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgTUxDYXB0aW9uTW9kdWxlLCBDZHNCdXR0b25Nb2R1bGVdLFxuICBkZWNsYXJhdGlvbnM6IFtUdXJuT2ZmTm90aWZpY2F0aW9uc1NoZWV0XSxcbiAgZXhwb3J0czogW1R1cm5PZmZOb3RpZmljYXRpb25zU2hlZXRdLFxuICBzY2hlbWFzOiBbQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQV0sXG4gIHByb3ZpZGVyczogW0Nkc0xhbmdQaXBlXVxufSlcbmV4cG9ydCBjbGFzcyBUdXJuT2ZmTm90aWZpY2F0aW9uc1NoZWV0TW9kdWxlIHt9XG4iXX0=