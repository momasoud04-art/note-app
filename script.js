(function () {
  'use strict';
  var KEY = 'notes-app-v1';
  var notes = load();

  var form = document.getElementById('note-form');
  var titleEl = document.getElementById('note-title');
  var textEl = document.getElementById('note-text');
  var pinnedEl = document.getElementById('pinned-notes');
  var otherEl = document.getElementById('other-notes');

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var data = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch (e) { return []; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(notes)); } catch (e) {}
  }
  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function card(note) {
    var el = document.createElement('article');
    el.className = 'note' + (note.pinned ? ' is-pinned' : '');
    el.setAttribute('data-testid', 'note');
    el.setAttribute('data-id', note.id);

    if (note.title) {
      var h = document.createElement('h3');
      h.textContent = note.title;
      el.appendChild(h);
    }
    var p = document.createElement('p');
    p.textContent = note.text;
    el.appendChild(p);

    var actions = document.createElement('div');
    actions.className = 'note-actions';

    var pin = document.createElement('button');
    pin.type = 'button';
    pin.setAttribute('data-testid', 'pin-note');
    pin.textContent = note.pinned ? 'إلغاء التثبيت' : 'تثبيت';
    pin.addEventListener('click', function () { togglePin(note.id); });

    var del = document.createElement('button');
    del.type = 'button';
    del.className = 'delete';
    del.setAttribute('data-testid', 'delete-note');
    del.textContent = 'حذف';
    del.addEventListener('click', function () { removeNote(note.id); });

    actions.appendChild(pin);
    actions.appendChild(del);
    el.appendChild(actions);
    return el;
  }

  function fill(container, list, emptyText) {
    container.innerHTML = '';
    if (!list.length) {
      var e = document.createElement('p');
      e.className = 'empty';
      e.textContent = emptyText;
      container.appendChild(e);
      return;
    }
    list.forEach(function (n) { container.appendChild(card(n)); });
  }

  function render() {
    var pinned = notes.filter(function (n) { return n.pinned; });
    var other = notes.filter(function (n) { return !n.pinned; });
    fill(pinnedEl, pinned, 'لا توجد ملاحظات مثبّتة.');
    fill(otherEl, other, 'لا توجد ملاحظات بعد. أضف أول ملاحظة.');
  }

  function addNote(title, text) {
    notes.unshift({ id: uid(), title: title, text: text, pinned: false });
    save(); render();
  }
  function togglePin(id) {
    notes.forEach(function (n) { if (n.id === id) n.pinned = !n.pinned; });
    save(); render();
  }
  function removeNote(id) {
    notes = notes.filter(function (n) { return n.id !== id; });
    save(); render();
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var title = titleEl.value.trim();
    var text = textEl.value.trim();
    if (!text) { textEl.focus(); return; }
    addNote(title, text);
    titleEl.value = '';
    textEl.value = '';
    textEl.focus();
  });

  render();
})();
