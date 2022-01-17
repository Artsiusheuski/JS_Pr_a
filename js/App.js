import NotesView from "./NotesView.js";
import NotesAPI from "./NotesAPI.js";
export default class App {
  constructor(root) {
    this.notes = [];
    this.activeNote = null; //будет хранить ссылку на текущие активные заметки
    this.view = new NotesView(root, this.handlers()); //новый экзепляр ,проходящий через заметки
    this.refreshNotes();
  }

  refreshNotes() {
    const notes = NotesAPI.getAllNotes(); //получаем заметки из API

    this.setNotes(notes);

    if (notes.length > 0) {
      this.setActiveNote(notes[0]);
    }
  }

  setNotes(notes) {
    this.notes = notes;
    this.view.updateNoteList(notes);
    this.view.updateNotePreviewVisibility(notes.length > 0);
  }

  setActiveNote(note) {
    this.activeNote = note;
    this.view.updateActiveNote(note); //обновление активной видимой заметки
  }

  handlers() {
    //обработчики
    return {
      onNoteSelect: (noteId) => {
        const selectedNote = this.notes.find((note) => note.id == noteId); //подсвечивает одинаковые id
        this.setActiveNote(selectedNote); //при клике выводит в body акт.ноту
      },
      onNoteAdd: () => {
        const newNote = {
          title: "",
          body: "",
        };

        NotesAPI.saveNote(newNote); //при клике  обновлякт body
        this.refreshNotes();
      },
      onNoteEdit: (title, body) => {
        NotesAPI.saveNote({
          id: this.activeNote.id,
          title,
          body,
        });

        this.refreshNotes(); //при выходе из редактирования(body) сохр.изменения
      },
      onNoteDelete: (noteId) => {
        //удалит по 2 клику
        NotesAPI.deleteNote(noteId);
        this.refreshNotes();
      },
    };
  }
}
