import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoomsListPage } from './rooms-list.page';

describe('RoomsListPage', () => {
  let component: RoomsListPage;
  let fixture: ComponentFixture<RoomsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomsListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
