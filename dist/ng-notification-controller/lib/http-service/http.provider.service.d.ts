import { HttpClient, HttpHeaders, HttpParams as AngularHttpParams } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { HttpResponse, HttpParams as CapacitorHttpParams } from '@capacitor/core';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
type HttpParams = AngularHttpParams | CapacitorHttpParams;
export declare const MOBILE_APP_HTTP_ORIGIN: InjectionToken<string>;
interface CapacitorHttpResponse extends HttpResponse {
    error?: boolean;
}
export declare class HttpProvider {
    private _http;
    private mobileAppHttpOrigin?;
    private _cookies;
    private isCapacitor;
    constructor(_http: HttpClient, mobileAppHttpOrigin?: string);
    private buildCapacitorHeaders;
    get<T>(url: string, _options?: {
        headers?: HttpHeaders;
        withCredentials?: boolean;
        params?: HttpParams;
    }): Observable<T>;
    post<T>(url: string, body: any, _options?: {
        headers?: HttpHeaders | any;
        withCredentials?: boolean;
    }): Observable<T>;
    handleCapacitorHttpRequest<T>(response: Partial<CapacitorHttpResponse>, startTime?: Date): T;
    addCookies(cookies: string): void;
    clearCookies(): void;
    get cookies(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<HttpProvider, [null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HttpProvider>;
}
export {};
