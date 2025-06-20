import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmManagementComponent } from './film-management.component';

describe('FilmManagementComponent', () => {
  let component: FilmManagementComponent;
  let fixture: ComponentFixture<FilmManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
