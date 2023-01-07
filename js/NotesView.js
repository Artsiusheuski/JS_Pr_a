export default class NotesView {
  //експорт класса по умолч.
  constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete }) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;
    this.root.innerHTML = `
          <div class="notes__sidebar">
              <button class="notes__add" type="button">Add note</button>
              <div class="notes__list"></div>
          </div>
          <div class="notes__preview">
              <input class="notes__title" type="text" placeholder="New note...">
              <textarea class="notes__body" placeholder="place for notes"></textarea>
          </div>
      `;

    const btnAddNote = this.root.querySelector(".notes__add");
    const inpTitle = this.root.querySelector(".notes__title");
    const inpBody = this.root.querySelector(".notes__body");

    btnAddNote.addEventListener("click", () => {
      // при клике на добавить заметку вызываем нов.зам.
      this.onNoteAdd();
    });

    [inpTitle, inpBody].forEach((inputField) => {
      inputField.addEventListener("blur", () => {
        // добавляем события(при потере фокуса) после выхода пользователя из поля ввода
        const updatedTitle = inpTitle.value.trim(); // обрезаем пробелы
        const updatedBody = inpBody.value.trim();

        this.onNoteEdit(updatedTitle, updatedBody);
      });
    });
  }

  createListItemHTML(id, title, body, updated) {
    // метод,для созданеия списка sideBar
    const max_body_length = 35;

    return `
          <div class="notes__list-item" data-note-id="${id}">
              <div class="notes__small-title">${title}</div>
              <div class="notes__small-body">
                  ${body.substring(0, max_body_length)}
                  ${body.length > max_body_length ? "..." : ""}
              </div>
              <div class="notes__small-updated">
                  ${updated.toLocaleString({
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
              </div>
          </div>
      `;
  }

  updateNoteList(notes) {
    const notesListContainer = this.root.querySelector(".notes__list");

    // Пустой список  Empty list
    notesListContainer.innerHTML = "";

    for (const note of notes) {
      //создаст  HTML для каждой заметки
      const html = this.createListItemHTML(
        note.id,
        note.title,
        note.body,
        new Date(note.updated)
      );

      notesListContainer.insertAdjacentHTML("beforeend", html); //всавит в конце еонтейнера
    }

    // Добавить события выбора / удаления для каждого элемента списка
    notesListContainer
      .querySelectorAll(".notes__list-item")
      .forEach((noteListItem) => {
        noteListItem.addEventListener("click", () => {
          this.onNoteSelect(noteListItem.dataset.noteId); // переходим по клику на выбраную заметку
        });
        noteListItem.addEventListener("dblclick", () => {
          // по 2 клику удаляем заметку
          const doDelete = confirm("Deleted note?");
          if (doDelete) {
            this.onNoteDelete(noteListItem.dataset.noteId);
          }
        });
      });
  }

  updateActiveNote(note) {
    this.root.querySelector(".notes__title").value = note.title; //назначаем стили при доб.заметки
    this.root.querySelector(".notes__body").value = note.body;

    this.root.querySelectorAll(".notes__list-item").forEach((noteListItem) => {
      // перебираем с курсором
      noteListItem.classList.remove("notes__list-item--selected");
    });

    this.root
      .querySelector(`.notes__list-item[data-note-id="${note.id}"]`) //классы к уже сущ.заметкам
      .classList.add("notes__list-item--selected");
  }

  updateNotePreviewVisibility(visible) {
    this.root.querySelector(".notes__preview").style.visibility = visible
      ? "visible"
      : "hidden";
  }

}
