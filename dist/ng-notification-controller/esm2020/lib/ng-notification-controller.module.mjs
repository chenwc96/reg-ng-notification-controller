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
import * as i0 from "@angular/core";
export class NgNotificationControllerModule {
}
NgNotificationControllerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: NgNotificationControllerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
NgNotificationControllerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.2.10", ngImport: i0, type: NgNotificationControllerModule, declarations: [NgNotificationControllerComponent], imports: [CommonModule,
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
        CdsIonSwitchModule], exports: [NgNotificationControllerComponent] });
NgNotificationControllerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: NgNotificationControllerModule, imports: [CommonModule,
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
        CdsIonSwitchModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.2.10", ngImport: i0, type: NgNotificationControllerModule, decorators: [{
            type: NgModule,
            args: [{
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
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmctbm90aWZpY2F0aW9uLWNvbnRyb2xsZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvbmctbm90aWZpY2F0aW9uLWNvbnRyb2xsZXIvc3JjL2xpYi9uZy1ub3RpZmljYXRpb24tY29udHJvbGxlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHNCQUFzQixFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGlDQUFpQyxFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDM0YsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBQ25FLE9BQU8sRUFBRSw4QkFBOEIsRUFBRSxNQUFNLDBFQUEwRSxDQUFDO0FBQzFILE9BQU8sRUFBRSwrQkFBK0IsRUFBRSxNQUFNLDRFQUE0RSxDQUFDO0FBQzdILE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUM3RSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNyRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDaEUsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzVELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQzs7QUF3QjlELE1BQU0sT0FBTyw4QkFBOEI7OzRIQUE5Qiw4QkFBOEI7NkhBQTlCLDhCQUE4QixpQkFyQjFCLGlDQUFpQyxhQUU5QyxZQUFZO1FBQ1osbUJBQW1CO1FBQ25CLGVBQWU7UUFDZixpQkFBaUI7UUFDakIsb0JBQW9CO1FBQ3BCLGtCQUFrQjtRQUNsQixlQUFlO1FBQ2YsYUFBYTtRQUNiLGNBQWM7UUFDZCxlQUFlO1FBQ2YsOEJBQThCO1FBQzlCLCtCQUErQjtRQUMvQixrQkFBa0IsYUFHVixpQ0FBaUM7NkhBSWhDLDhCQUE4QixZQW5CdkMsWUFBWTtRQUNaLG1CQUFtQjtRQUNuQixlQUFlO1FBQ2YsaUJBQWlCO1FBQ2pCLG9CQUFvQjtRQUNwQixrQkFBa0I7UUFDbEIsZUFBZTtRQUNmLGFBQWE7UUFDYixjQUFjO1FBQ2QsZUFBZTtRQUNmLDhCQUE4QjtRQUM5QiwrQkFBK0I7UUFDL0Isa0JBQWtCOzRGQU9ULDhCQUE4QjtrQkF0QjFDLFFBQVE7bUJBQUM7b0JBQ1IsWUFBWSxFQUFFLENBQUMsaUNBQWlDLENBQUM7b0JBQ2pELE9BQU8sRUFBRTt3QkFDUCxZQUFZO3dCQUNaLG1CQUFtQjt3QkFDbkIsZUFBZTt3QkFDZixpQkFBaUI7d0JBQ2pCLG9CQUFvQjt3QkFDcEIsa0JBQWtCO3dCQUNsQixlQUFlO3dCQUNmLGFBQWE7d0JBQ2IsY0FBYzt3QkFDZCxlQUFlO3dCQUNmLDhCQUE4Qjt3QkFDOUIsK0JBQStCO3dCQUMvQixrQkFBa0I7cUJBQ25CO29CQUNELE9BQU8sRUFBRSxDQUFDLHNCQUFzQixDQUFDO29CQUNqQyxPQUFPLEVBQUUsQ0FBQyxpQ0FBaUMsQ0FBQztpQkFDN0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDVVNUT01fRUxFTUVOVFNfU0NIRU1BLCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IE5nTm90aWZpY2F0aW9uQ29udHJvbGxlckNvbXBvbmVudCB9IGZyb20gJy4vbmctbm90aWZpY2F0aW9uLWNvbnRyb2xsZXIuY29tcG9uZW50JztcbmltcG9ydCB7IE1MQ2FwdGlvbk1vZHVsZSB9IGZyb20gJy4vbW9kdWxlcy9jYXB0aW9uL2NhcHRpb24ubW9kdWxlJztcbmltcG9ydCB7IFR1cm5Pbk5vdGlmaWNhdGlvbnNTaGVldE1vZHVsZSB9IGZyb20gJy4vbW9kdWxlcy90dXJuLW9uLW5vdGlmaWNhdGlvbnMtc2hlZXQvdHVybi1vbi1ub3RpZmljYXRpb25zLXNoZWV0Lm1vZHVsZSc7XG5pbXBvcnQgeyBUdXJuT2ZmTm90aWZpY2F0aW9uc1NoZWV0TW9kdWxlIH0gZnJvbSAnLi9tb2R1bGVzL3R1cm4tb2ZmLW5vdGlmaWNhdGlvbnMtc2hlZXQvdHVybi1vZmYtbm90aWZpY2F0aW9ucy1zaGVldC5tb2R1bGUnO1xuaW1wb3J0IHsgUmVhY3RpdmVGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE1hdERpYWxvZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL21hdGVyaWFsL2RpYWxvZyc7XG5pbXBvcnQgeyBDZHNMYW5ndWFnZU1vZHVsZSB9IGZyb20gJ0BjZHMvbmctY29yZS9sYW5nJztcbmltcG9ydCB7IENkc0JvdHRvbVNoZWV0TW9kdWxlIH0gZnJvbSAnQGNkcy9uZy1pb25pYy1jb21wb25lbnRzL2JvdHRvbS1zaGVldCc7XG5pbXBvcnQgeyBDZHNJb25Td2l0Y2hNb2R1bGUgfSBmcm9tICdAY2RzL25nLWlvbmljLWNvbXBvbmVudHMvc3dpdGNoJztcbmltcG9ydCB7IENkc0lvblRvcEJhck1vZHVsZSB9IGZyb20gJ0BjZHMvbmctaW9uaWMtY29tcG9uZW50cy90b3AtYmFyJztcbmltcG9ydCB7IENkc0J1dHRvbk1vZHVsZSB9IGZyb20gJ0BjZHMvbmctd2ViLWNvbXBvbmVudHMvYnV0dG9uJztcbmltcG9ydCB7IENkc0ljb25Nb2R1bGUgfSBmcm9tICdAY2RzL25nLXdlYi1jb21wb25lbnRzL2ljb24nO1xuaW1wb3J0IHsgQ2RzUG9wdXBNb2R1bGUgfSBmcm9tICdAY2RzL25nLXdlYi1jb21wb25lbnRzL3BvcHVwJztcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbTmdOb3RpZmljYXRpb25Db250cm9sbGVyQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBSZWFjdGl2ZUZvcm1zTW9kdWxlLFxuICAgIE1hdERpYWxvZ01vZHVsZSxcbiAgICBDZHNMYW5ndWFnZU1vZHVsZSxcbiAgICBDZHNCb3R0b21TaGVldE1vZHVsZSxcbiAgICBDZHNJb25Ub3BCYXJNb2R1bGUsXG4gICAgQ2RzQnV0dG9uTW9kdWxlLFxuICAgIENkc0ljb25Nb2R1bGUsXG4gICAgQ2RzUG9wdXBNb2R1bGUsXG4gICAgTUxDYXB0aW9uTW9kdWxlLFxuICAgIFR1cm5Pbk5vdGlmaWNhdGlvbnNTaGVldE1vZHVsZSxcbiAgICBUdXJuT2ZmTm90aWZpY2F0aW9uc1NoZWV0TW9kdWxlLFxuICAgIENkc0lvblN3aXRjaE1vZHVsZVxuICBdLFxuICBzY2hlbWFzOiBbQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQV0sXG4gIGV4cG9ydHM6IFtOZ05vdGlmaWNhdGlvbkNvbnRyb2xsZXJDb21wb25lbnRdXG59KVxuXG5cbmV4cG9ydCBjbGFzcyBOZ05vdGlmaWNhdGlvbkNvbnRyb2xsZXJNb2R1bGUge31cbiJdfQ==