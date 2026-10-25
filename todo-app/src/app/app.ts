import { Component, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// Type pour les filtres possibles
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

  // Nouveau signal : le filtre actif (valeur par défaut : 'all')
  filter = signal<Filter>('all');

  total = computed(() => this.todos().length);
  remaining = computed(() => this.todos().filter(t => !t.done).length);

  // computed qui dépend de deux signaux : todos() et filter()
  filteredTodos = computed(() => {
    const f = this.filter();
    const list = this.todos();
    if (f === 'active') return list.filter(t => !t.done);
    if (f === 'done') return list.filter(t => t.done);
    return list;
  });

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

  // Méthode pour changer le filtre
  setFilter(newFilter: Filter) {
    this.filter.set(newFilter);
  }
}
