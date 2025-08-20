import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams as AngularHttpParams,
} from '@angular/common/http';
import { Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import {
  HttpOptions,
  CapacitorHttp,
  HttpResponse,
  HttpParams as CapacitorHttpParams,
} from '@capacitor/core';
import { isPlatform } from '@ionic/angular';
import { Observable, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { RequestHeader } from './request-header.enum';

type HttpParams = AngularHttpParams | CapacitorHttpParams;

export const MOBILE_APP_HTTP_ORIGIN = new InjectionToken<string>(
  'MOBILE_APP_HTTP_ORIGIN'
);

interface CapacitorHttpResponse extends HttpResponse {
  error?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class HttpProvider {
  private _cookies = new Map<string, string>();
  private isCapacitor = isPlatform('capacitor');

  constructor(
    private _http: HttpClient,
    @Optional()
    @Inject(MOBILE_APP_HTTP_ORIGIN)
    private mobileAppHttpOrigin?: string
  ) {
    this.isCapacitor = isPlatform('capacitor');
  }

  private buildCapacitorHeaders(method: string, url: string) {
    const origin = this.mobileAppHttpOrigin || window.location.origin;
    const header = {
      [RequestHeader.CONTENT_TYPE]: 'application/json',
      // [RequestHeader.ORIGIN]: origin,
      [RequestHeader.X_MOBILE_APP]: 'capacitor',
      [RequestHeader.X_MOBILE_PLATFORM]: isPlatform('ios') ? 'ios' : 'android',
    };
    return header;
  }

  get<T>(
    url: string,
    _options?: {
      headers?: HttpHeaders;
      withCredentials?: boolean;
      params?: HttpParams;
    }
  ): Observable<T> {
    if (this.isCapacitor) {
      const _url = new URL(url);
      _url.searchParams;

      const options: HttpOptions = {
        headers: {
          ...this.buildCapacitorHeaders('GET', url),
          ..._options?.headers,
        },
        url,
        params: _options?.params as CapacitorHttpParams,
      };
      const startTime = new Date();

      return from(CapacitorHttp.get(options)).pipe(
        map((response) =>
          this.handleCapacitorHttpRequest<T>(response, startTime)
        ),
        catchError((error) => {
          throw error;
        })
      );
    }

    return this._http.get<T>(url, _options);
  }

  post<T>(
    url: string,
    body: any,
    _options?: { headers?: HttpHeaders | any; withCredentials?: boolean }
  ): Observable<T> {
    if (this.isCapacitor) {
      const options: HttpOptions = {
        headers: {
          ...this.buildCapacitorHeaders('POST', url),
          ..._options?.headers,
        },
        url,
        data: body || undefined,
      };
      const startTime = new Date();
      return from(CapacitorHttp.post(options)).pipe(
        map((response) =>
          this.handleCapacitorHttpRequest<T>(response, startTime)
        )
      );
    }
    return this._http.post<T>(url, body, _options);
  }

  handleCapacitorHttpRequest<T>(
    response: Partial<CapacitorHttpResponse>,
    startTime?: Date
  ): T {
    if (startTime) {
      const endTime = new Date();
      const timeToComplete = endTime.getTime() - startTime.getTime();
      console.log(
        `Time to complete request ${response.url}: ${timeToComplete}`
      );
    }

    if (response?.error || response?.status >= 400) {
      const error =
        typeof response.data === 'string'
          ? JSON.parse(response.data)
          : response.data;
      throw new HttpErrorResponse({
        ...response,
        error,
        url: response.url,
        status: response.status,
        headers: response.headers as unknown as HttpHeaders,
      });
    }
    const headers = response?.headers;

    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        if (key.toLowerCase() === 'set-cookie') {
          this.addCookies(value);
        }
      });
    }

    return response?.data as T;
  }

  addCookies(cookies: string) {
    const _cookies = cookies.split(', ');
    _cookies.forEach((cookie) => {
      const [key, value] = cookie.split('=');
      if (value) {
        this._cookies.set(key, value);
      }
    });
  }

  clearCookies() {
    this._cookies.clear();
  }

  get cookies(): string {
    const cookies = [];
    for (let [key, value] of this._cookies.entries()) {
      cookies.push(`${key}=${value}`);
    }
    return cookies.join('; ');
  }
}
