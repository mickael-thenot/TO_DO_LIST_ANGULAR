import { Component, input, output } from '@angular/core';
import { Todo } from '../app';

@Component({
  imports: [],
  selector: 'app-todo-item',
  styleUrl: './todo-item.css',
  templateUrl: './todo-item.html',
})
export class TodoItem {
  // Input : la tâche à afficher
  todo = input.required<Todo>();

  // Outputs : événements émis vers le parent
  toggle = output<number>();
  remove = output<number>();
}
