(() => {
  // Model danych: Hierarchia Uniwersum
  // Struktura: Uniwersum -> Świat -> Tom -> Rozdział -> Podrozdział/Fragment
  // Każdy element: { id, parentId, type, title, dateCreated, version, language, content, notes, children: [] }
  const STORAGE_KEY = 'bella_author_mode_universe';

  // Globalny przełącznik fabular generation OFF - system nie generuje fabuły
  const FABULAR_GENERATION = false; // permanentnie OFF w AUTHOR MODE

  // Obecny zaznaczony element
  let selectedElementId = null;

  // Dane całego uniwersum
  let universeData = loadData();

  // Elementy DOM
  const universeListEl = document.getElementById('universeList');
  const outputEl = document.getElementById('output');
  const archiveOutputEl = document.getElementById('archiveOutput');

  const elementTypeEl = document.getElementById('elementType');
  const elementTitleEl = document.getElementById('elementTitle');
  const elementDateEl = document.getElementById('elementDate');
  const elementVersionEl = document.getElementById('elementVersion');
  const elementLanguageEl = document.getElementById('elementLanguage');
  const elementContentEl = document.getElementById('elementContent');
  const elementNotesEl = document.getElementById('elementNotes');

  const saveElementBtn = document.getElementById('saveElementBtn');
  const deleteElementBtn = document.getElementById('deleteElementBtn');
  const addUniverseBtn = document.getElementById('addUniverseBtn');
  const addChildBtn = document.getElementById('addChildBtn');

  const backupAllBtn = document.getElementById('backupAllBtn');
  const exportBtn = document.getElementById('exportBtn');
  const exportSelectEl = document.getElementById('exportSelect');

  // Pomocnicze - unikalne ID
  function generateId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
  }

  // Załaduj dane z localStorage lub utwórz pustą strukturę
  function loadData() {
    try {
      const json = localStorage.getItem(STORAGE_KEY);
      if (json) return JSON.parse(json);
    } catch (e) {
      console.error('Błąd ładowania danych:', e);
    }
    return [];
  }

  // Zapisz dane do localStorage
  function saveData() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(universeData));
    } catch (e) {
      console.error('Błąd zapisu danych:', e);
    }
  }

  // Znajdź element po ID w strukturze rekurencyjnie (zwraca obiekt oraz rodzica)
  function findElementById(id, elements = universeData, parent = null) {
    for (const el of elements) {
      if (el.id === id) return { element: el, parent };
      if (el.children && el.children.length) {
        const found = findElementById(id, el.children, el);
        if (found) return found;
      }
    }
    return null;
  }

  // Renderuj listę uniwersum w panelu struktury
  function renderUniverseList() {
    universeListEl.innerHTML = '';
    if (!universeData.length) {
      universeListEl.textContent = 'Brak Uniwersów. Dodaj nowy.';
      return;
    }
    const ul = document.createElement('ul');
    ul.className = 'hierarchy';
    universeData.forEach(universe => {
      ul.appendChild(renderElementNode(universe));
    });
    universeListEl.appendChild(ul);
  }

  // Render pojedynczego elementu oraz jego dzieci
  function renderElementNode(element) {
    const li = document.createElement('li');
    li.textContent = `[element.type]{element.type}]element.type]{element.title || '(Bez tytułu)'}`;
    li.title = `Wersja: element.version∣∣′v1′,Język:{element.version || 'v1'}, Język:element.version∣∣′v1′,Język:{element.language || 'pl'}`;
    li.dataset.id = element.id;
    li.tabIndex = 0;
    if (element.id === selectedElementId) li.classList.add('selected');

    // Kliknięcie zaznacza element
    li.addEventListener('click', (e) => {
      e.stopPropagation();
      selectElement(element.id);
    });
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectElement(element.id);
      }
    });

    if (element.children && element.children.length) {
      const ul = document.createElement('ul');
      ul.className = 'hierarchy';
      element.children.forEach(child => ul.appendChild(renderElementNode(child)));
      li.appendChild(ul);
    }
    return li;
  }

  // Wybierz element i załaduj do edytora
  function selectElement(id) {
    const found = findElementById(id);
    if (!found) return;
    selectedElementId = id;
    renderUniverseList();
    loadElementToEditor(found.element);
    outputEl.textContent = '';
  }

  // Załaduj dane elementu do edytora
  function loadElementToEditor(el) {
    elementTypeEl.value = el.type;
    elementTitleEl.value = el.title || '';
    elementDateEl.value = new Date(el.dateCreated).toLocaleString() || '';
    elementVersionEl.value = el.version || 'v1';
    elementLanguageEl.value = el.language || 'pl';
    elementContentEl.value = el.content || '';
    elementNotesEl.value = el.notes || '';
    updateButtonsState(true);
  }

  // Wyczyszczenie edytora i odznaczenie elementu
  function clearEditor() {
    selectedElementId = null;
    elementTypeEl.value = '';
    elementTitleEl.value = '';
    elementDateEl.value = '';
    elementVersionEl.value = '';
    elementLanguageEl.value = 'pl';
    elementContentEl.value = '';
    elementNotesEl.value = '';
    updateButtonsState(false);
    renderUniverseList();
    outputEl.textContent = 'Edytor wyczyszczony.';
  }

  // Aktualizacja stanu przycisków (usuń/dodaj dziecko) w zależności od wybranego elementu
  function updateButtonsState(enabled) {
    deleteElementBtn.disabled = !enabled;
    addChildBtn.disabled = !enabled;
    saveElementBtn.disabled = !enabled;
  }

  // Dodaj nowy element na poziomie Uniwersum (najwyższy poziom)
  addUniverseBtn.addEventListener('click', () => {
    const newUniverse = createNewElement('Uniwersum');
    universeData.push(newUniverse);
    saveData();
    selectedElementId = newUniverse.id;
    renderUniverseList();
    loadElementEditor(newUniverse);
    outputEl.textContent = 'Dodano nowe Uniwersum.';
  });

  // Tworzy nowy element z datą, wersją, ID i pustymi polami
  function createNewElement(type, parent = null) {
    return {
      id: generateId(),
      parentId: parent ? parent.id : null,
      type,
      title: '',
      dateCreated: new Date().toISOString(),
      version: 'v1',
      language: 'pl',
      content: '',
      notes: '',
      children: []
    };
  }

  // Obsługa zapisu zmian elementu
  saveElementBtn.addEventListener('click', () => {
    if (!selectedElementId) {
      outputEl.textContent = 'Brak wybranego elementu do zapisu.';
      return;
    }
    const found = findElementById(selectedElementId);
    if (!found) {
      outputEl.textContent = 'Element nie został znaleziony.';
      return;
    }
    // Walidacja tytułu
    if (!elementTitleEl.value.trim()) {
      outputEl.textContent = 'Tytuł nie może być pusty!';
      return;
    }
    // Aktualizacja danych
    const el = found.element;
    el.title = elementTitleEl.value.trim();
    // DataCreated pozostaje stała
    el.version = elementVersionEl.value.trim() || el.version || 'v1';
    el.language = elementLanguageEl.value || 'pl';
    el.content = elementContentEl.value;
    el.notes = elementNotesEl.value;

    saveData();
    renderUniverseList();
    outputEl.textContent = `Zapisano zmiany w elemencie "${el.title}".`;
  });

  // Usuwanie wybranego elementu wraz z dziećmi
  deleteElementBtn.addEventListener('click', () => {
    if (!selectedElementId) {
      outputEl.textContent = 'Brak wybranego elementu do usunięcia.';
      return;
    }
    if (!confirm('Czy na pewno chcesz usunąć ten element wraz z wszystkimi podrzędnymi?')) return;

    const found = findElementById(selectedElementId);
    if (!found) {
      outputEl.textContent = 'Element nie został znaleziony.';
      return;
    }

    if (found.parent) {
      // Usuwamy z dzieci rodzica
      found.parent.children = found.parent.children.filter(c => c.id !== selectedElementId);
    } else {
      // Usuwamy z root
      universeData = universeData.filter(el => el.id !== selectedElementId);
    }
    saveData();
    clearEditor();
    renderUniverseList();
    outputEl.textContent = 'Element usunięty.';
  });

  // Dodawanie dziecka do wybranego elementu
  addChildBtn.addEventListener('click', () => {
    if (!selectedElementId) {
      outputEl.textContent = 'Wybierz element, do którego chcesz dodać podrzędny.';
      return;
    }
    const found = findElementById(selectedElementId);
    if (!found) {
      outputEl.textContent = 'Wybrany element nie został znaleziony.';
      return;
    }
    // Określamy typ podrzędny na podstawie typu rodzica (poziom hierarchii)
    const nextType = getChildType(found.element.type);
    if (!nextType) {
      outputEl.textContent = `Nie można dodać podrzędnego elementu do typu "${found.element.type}".`;
      return;
    }
    const newChild = createNewElement(nextType, found.element);
    found.element.children.push(newChild);
    saveData();
    renderUniverseList();
    selectedElementId = newChild.id;
    loadElementToEditor(newChild);
    outputEl.textContent = `Dodano nowy element typu "${nextType}".`;
  });

  // Określa typ dziecka na podstawie typu rodzica wg hierarchii
  function getChildType(parentType) {
    switch (parentType) {
      case 'Uniwersum': return 'Świat';
      case 'Świat': return 'Tom';
      case 'Tom': return 'Rozdział';
      case 'Rozdział': return 'Podrozdział / Fragment';
      case 'Podrozdział / Fragment': return null;
      default: return null;
    }
  }

  // Załaduj element do edytora (pomocnicza)
  function loadElementEditor(el) {
    selectedElementId = el.id;
    renderUniverseList();
    loadElementToEditor(el);
  }

  // Backup całego projektu (archiwum autora) - eksport do JSON i pobranie pliku
  backupAllBtn.addEventListener('click', () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `Bella_Archiwum_Backup_${timestamp}.json`;
    const blob = new Blob([JSON.stringify(universeData, null, 2)], { type: 'application/json' });
    triggerDownload(blob, filename);
    archiveOutputEl.textContent = `Backup wykonany: ${filename}`;
  });

  // Eksport wybranego elementu do wybranego formatu
  exportBtn.addEventListener('click', () => {
    if (!selectedElementId) {
      archiveOutputEl.textContent = 'Wybierz element do eksportu.';
      return;
    }
    const found = findElementById(selectedElementId);
    if (!found) {
      archiveOutputEl.textContent = 'Nie znaleziono wybranego elementu.';
      return;
    }
    const el = found.element;
    const format = exportSelectEl.value;
    exportElement(el, format);
  });

  // Eksport elementu do formatu docx, pdf, txt
  async function exportElement(el, format) {
    const title = `[el.type]{el.type}]el.type]{el.title || '(Bez tytułu)'}`;
    const content = el.content || '';
    const notes = el.notes ? `\n\nNOTATKI AUTORA:\n${el.notes}` : '';
    const text = `title\nWersja:{title}\nWersja:title\nWersja:{el.version}\nJęzyk: el.language\nData:{el.language}\nData:el.language\nData:{new Date(el.dateCreated).toLocaleString()}\n\ncontent{content}content{notes}`;

    if (format === 'docx') {
      const doc = new docx.Document({
        sections: [{
          children: [
            new docx.Paragraph({ text: title, heading: docx.HeadingLevel.HEADING_1 }),
            new docx.Paragraph(`Wersja: ${el.version}`),
            new docx.Paragraph(`Język: ${el.language}`),
            new docx.Paragraph(`Data utworzenia: ${new Date(el.dateCreated).toLocaleString()}`),
            new docx.Paragraph(''),
            new docx.Paragraph(content),
            ...(el.notes ? [new docx.Paragraph(''), new docx.Paragraph('NOTATKI AUTORA:'), new docx.Paragraph(el.notes)] : [])
          ],
        }],
      });
      const blob = await docx.Packer.toBlob(doc);
      const filename = sanitizeFilename(`${title}.docx`);
      triggerDownload(blob, filename);
      archiveOutputEl.textContent = `Eksportowano ${filename}`;
    } else if (format === 'pdf') {
      // Używamy jsPDF
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const maxWidth = pageWidth - margin * 2;

      pdf.setFontSize(16);
      pdf.text(title, margin, 20);
      pdf.setFontSize(10);
      pdf.text(`Wersja: ${el.version}`, margin, 30);
      pdf.text(`Język: ${el.language}`, margin, 36);
      pdf.text(`Data utworzenia: ${new Date(el.dateCreated).toLocaleString()}`, margin, 42);

      pdf.setFontSize(12);
      const splitText = pdf.splitTextToSize(content + notes, maxWidth);
      pdf.text(splitText, margin, 55);

      const filename = sanitizeFilename(`${title}.pdf`);
      pdf.save(filename);
      archiveOutputEl.textContent = `Eksportowano ${filename}`;
    } else if (format === 'txt') {
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const filename = sanitizeFilename(`${title}.txt`);
      triggerDownload(blob, filename);
      archiveOutputEl.textContent = `Eksportowano ${filename}`;
    } else {
      archiveOutputEl.textContent = 'Nieznany format eksportu.';
    }
  }

  // Pomocnicza funkcja pobierania pliku
  function triggerDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Usuwa znaki niedozwolone w nazwach plików
  function sanitizeFilename(name) {
    return name.replace(/[\/\\?%*:|"<>]/g, '-');
  }

  // Inicjalizacja - render listy i czyść edytor
  renderUniverseList();
  clearEditor();

  // --- TRYB AUTORA - blokada generowania fabuły ---
  // System NIE generuje fabuły, NIE proponuje stylu ani narracji
  // W związku z tym funkcje generowania fabuły są wyłączone i nie istnieją

  // Dodatkowo można wprowadzić ostrzeżenia przy próbie generowania (jeśli dodasz GUI do tego w przyszłości)

})();
