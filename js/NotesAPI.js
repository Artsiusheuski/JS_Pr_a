export default class NotesAPI {
  static getAllNotes() {
    //получает заметки по умолчанию и можем вызвать каждый раз
    const notes = JSON.parse(localStorage.getItem("notesapp-notes") || "[]"); // получаем пустой массив если нет существ.заметок
    return notes.sort((a, b) => {
      return new Date(a.updated) > new Date(b.updated) ? -1 : 1; //алгоритм сортировки
    });
  }

  static saveNote(noteToSave) {
    //сохраняет заметки
    const notes = NotesAPI.getAllNotes(); // ссылка на создан.заметки
    const existing = notes.find((note) => note.id == noteToSave.id);

    // Редактировать / Обновить  Edit/Update
    if (existing) {
      // если сущ.заметки с тем же ид равны, то будет обновление или ред.
      existing.title = noteToSave.title;
      existing.body = noteToSave.body;
      existing.updated = new Date().toISOString();
    } else {
      // иначе будет вставка
      noteToSave.id = Math.floor(Math.random() * 1000000); // инд.обновления времени для заметки.случайный инд.
      noteToSave.updated = new Date().toISOString(); //обновленная точка времени будет равна текущей точки времени
      notes.push(noteToSave); // пушим заметки в список
    }

    localStorage.setItem("notesapp-notes", JSON.stringify(notes));
  }

  static deleteNote(id) {
    // удаляет заметки
    const notes = NotesAPI.getAllNotes(); // получает сущ.заметки
    const newNotes = notes.filter((note) => note.id != id); // получаем заметку у которой нет ид

    localStorage.setItem("notesapp-notes", JSON.stringify(newNotes));
  }
}
