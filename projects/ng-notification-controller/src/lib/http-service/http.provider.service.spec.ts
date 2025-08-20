import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Platform } from '@ionic/angular';
import { from, of } from 'rxjs';
import { HttpProvider } from './http.provider.service';

describe('HttpProvider', () => {
  let httpProvider: HttpProvider;
  let platform: Platform;
  let httpTestingController: HttpTestingController;
  let capacitorHttpGetSpy: { get: jasmine.Spy };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [],
    });
    httpProvider = TestBed.inject(HttpProvider);
    platform = TestBed.inject(Platform);
    capacitorHttpGetSpy = jasmine.createSpyObj('CapacitorHttp', ['get']);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(httpProvider).toBeTruthy();
  });

  it('should get', () => {
    httpProvider.get('');
    expect(httpProvider).toBeTruthy();
  });

  it('should get isCapacitor = true', () => {
    httpProvider['isCapacitor'] = true;
    let mockResponse = {} as any;
    capacitorHttpGetSpy.get.and.returnValue(of(mockResponse));
    from(
      httpProvider.get(
        'https://api.emmsit.asia.manulife.com/ext/regional-move-service-facade/api/vn'
      )
    ).subscribe({
      next: (response) => {
        expect(response).withContext('Expected data response').toBeUndefined();
      },
    });
    //httpProvider.get("https://api.emmsit.asia.manulife.com/ext/regional-move-service-facade/api/vn");
    expect(httpProvider).toBeTruthy();
  });

  it('should post', () => {
    httpProvider.post('', {});
    expect(httpProvider).toBeTruthy();
  });

  it('should get isCapacitor = true', () => {
    httpProvider['isCapacitor'] = true;
    httpProvider.post(
      'https://api.emmsit.asia.manulife.com/ext/regional-move-service-facade/api/vn',
      {}
    );
    expect(httpProvider).toBeTruthy();
  });

  it('should handleCapacitorHttpRequest without error', () => {
    let mockResponse = {
      headers: {
        'set-cookie': 'abc=1434',
      },
      data: {},
    } as any;
    httpProvider.handleCapacitorHttpRequest(mockResponse, new Date());
    expect(httpProvider).toBeTruthy();
  });

  // it('should handleCapacitorHttpRequest with error', () => {
  //   let mockResponse = {
  //     headers: {
  //       'set-cookie': 'abc=1434',
  //     },
  //     data: {},
  //     error: {},
  //     status: 404,
  //   } as any;
  //   httpProvider.handleCapacitorHttpRequest(mockResponse, new Date());
  //   expect(httpProvider).toBeTruthy();
  // });

  it('should clearCookies', () => {
    httpProvider.clearCookies();
    expect(httpProvider).toBeTruthy();
  });

  it('should cookies', () => {
    const m = new Map<string, string>();
    m.set('fruit', 'banana');
    httpProvider['_cookies'] = m;
    httpProvider.cookies;
    expect(httpProvider).toBeTruthy();
  });
});
