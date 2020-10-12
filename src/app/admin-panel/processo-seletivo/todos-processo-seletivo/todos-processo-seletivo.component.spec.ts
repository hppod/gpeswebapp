import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosProcessoSeletivoComponent } from './todos-processo-seletivo.component';

describe('TodosProcessoSeletivoComponent', () => {
  let component: TodosProcessoSeletivoComponent;
  let fixture: ComponentFixture<TodosProcessoSeletivoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodosProcessoSeletivoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodosProcessoSeletivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
