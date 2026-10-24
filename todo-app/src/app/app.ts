import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

@Component({
  imports: [RouterOutlet, FormsModule],
  selector: 'app-root',
  standalone: true,
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('todo-app');

  todos = signal<Todo[]>([]);
  newTodo = '';
  private nextId = 0;

  addTodo() {
    if (this.newTodo.trim()) {
      this.todos.update(current => [
        ...current,
        { id: this.nextId++, text: this.newTodo.trim(), done: false }
      ]);
      this.newTodo = '';
    }
  }

  removeTodo(id: number) {
    this.todos.update(current => current.filter(t => t.id !== id));
  }

  toggleTodo(id: number) {
    this.todos.update(current =>
      current.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );
  }
}
