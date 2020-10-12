import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProcessoSeletivoComponent } from './create-processo-seletivo.component';

describe('CreateProcessoSeletivoComponent', () => {
  let component: CreateProcessoSeletivoComponent;
  let fixture: ComponentFixture<CreateProcessoSeletivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateProcessoSeletivoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProcessoSeletivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
