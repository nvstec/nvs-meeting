import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoomEventsPage } from './room-events.page';

describe('RoomEventsPage', () => {
  let component: RoomEventsPage;
  let fixture: ComponentFixture<RoomEventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomEventsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
