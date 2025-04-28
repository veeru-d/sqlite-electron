import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit {
  async ngOnInit() {
    const sqlite = new SQLiteConnection(CapacitorSQLite);
    console.log('sqlite=', JSON.stringify(sqlite));

    const db = await sqlite.createConnection(
      'todo',
      false,
      'no-encryption',
      0,
      false
    );
    console.log('db=', JSON.stringify(db));

    await db.open();

    const createTable = await db.execute(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0
      );`);
    console.log('createTable=', JSON.stringify(createTable));

    const addTodo = await db.run(
      'INSERT INTO todos (title, completed) VALUES (?, ?);',
      [`test todo ${Math.round(Math.random() * 1000)}`, 0]
    );
    console.log('addTodo=', JSON.stringify(addTodo));

    await db.close();
    await sqlite.closeConnection('todo', false);
  }
}
