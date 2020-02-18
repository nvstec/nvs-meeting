import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoomEventsModalPage } from './room-events-modal.page';

describe('RoomEventsModalPage', () => {
  let component: RoomEventsModalPage;
  let fixture: ComponentFixture<RoomEventsModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomEventsModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomEventsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
