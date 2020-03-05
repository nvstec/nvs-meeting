import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoomExtendModalPage } from './room-extend-modal.page';

describe('RoomExtendModalPage', () => {
  let component: RoomExtendModalPage;
  let fixture: ComponentFixture<RoomExtendModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomExtendModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomExtendModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
