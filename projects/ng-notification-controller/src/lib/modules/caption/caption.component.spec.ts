import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MLCaptionComponent } from './caption.component';
import { CdsLangPipe } from '@cds/ng-core/lang';

describe('MLCaptionComponent', () => {
  let component: MLCaptionComponent;
  let fixture: ComponentFixture<MLCaptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CdsLangPipe
      ],
      declarations: [MLCaptionComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MLCaptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('get caption', () => {
    component.caption;
    expect(component).toBeTruthy();
  });

  it('get caption fieldId is string', () => {
    component.fieldId = 'adb';
    component.caption;
    expect(component).toBeTruthy();
  });

});
