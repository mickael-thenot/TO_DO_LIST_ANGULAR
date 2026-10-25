import { Component, signal, computed, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export type Filter = 'all' | 'active' | 'done';

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

  filter = signal<Filter>('all');

  total = computed(() => this.todos().length);
  remaining = computed(() => this.todos().filter(t => !t.done).length);

  filteredTodos = computed(() => {
    const f = this.filter();
    const list = this.todos();
    if (f === 'active') return list.filter(t => !t.done);
    if (f === 'done') return list.filter(t => t.done);
    return list;
  });

  constructor() {
    // Charger depuis localStorage au démarrage
    const stored = localStorage.getItem('todos');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Todo[];
        this.todos.set(parsed);
        this.nextId = parsed.length > 0
          ? Math.max(...parsed.map(t => t.id)) + 1
          : 0;
      } catch {
        // JSON invalide -> on ignore, on repart de zéro
      }
    }

    // Sauvegarder automatiquement à chaque changement de todos
    effect(() => {
      localStorage.setItem('todos', JSON.stringify(this.todos()));
    });
  }

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

  setFilter(newFilter: Filter) {
    this.filter.set(newFilter);
  }
}
