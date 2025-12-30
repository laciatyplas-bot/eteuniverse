// script.js
// Eterniverse - Bella Asystent Redakcyjny (AUTHOR MODE)
// Profesjonalny rozbudowany skrypt JS z dynamicznym dodawaniem rozdziałów i fragmentów

const Eterniverse = (() => {
  "use strict";

  // Główne kontenery dynamicznych sekcji w DOM
  const container = document.querySelector("main section#dynamicContent");
  const output = document.getElementById("output");

  // Pole fabularnej generacji - zawsze OFF i zablokowany
  const fabularSwitch = document.getElementById("fabularSwitch");

  // Stałe localStorage
  const STORAGE_KEY = "eterniverse_project_data";

  // Inicjalizacja
  function init() {
    fabularSwitch.value = "off";
    fabularSwitch.disabled = true;

    // Przycisk do zapisu
    document.getElementById("saveBtn").addEventListener("click", saveProject);
    document.getElementById("exportTxtBtn").addEventListener("click", exportTxt);
    document.getElementById("exportDocxBtn").addEventListener("click", exportDocx);
    document.getElementById("exportPdfBtn").addEventListener("click", exportPdf);

    // Kontenery do dynamicznego dodawania treści
    prepareStaticFields();

    // Załaduj projekt jeśli istnieje
    loadProject();

    // Załaduj biblioteki do eksportu
    loadExternalLibraries();

    showMessage("System gotowy. Tryb AUTHOR MODE, fabularna generacja wyłączona.", "info");
  }

  // Pokaż komunikat w polu output
  function showMessage(msg, type = "info") {
    output.textContent = msg;
    output.className = type;
  }

  // Przygotuj pola statyczne i dynamiczne kontenery dla tomów i rozdziałów
  function prepareStaticFields() {
    // Uniwersum, Świat i Tom - statyczne pola (jak w HTML)
    // Stworzymy dynamiczne sekcje dla rozdziałów i fragmentów

    // Znajdź kontener na rozdziały
    const chaptersContainer = document.createElement("div");
    chaptersContainer.id = "chaptersContainer";
    chaptersContainer.setAttribute("aria-label", "Lista Rozdziałów");

    // Dodaj przycisk do dodawania rozdziałów
    const addChapterBtn = document.createElement("button");
    addChapterBtn.type = "button";
    addChapterBtn.textContent = "Dodaj nowy Rozdział";
    addChapterBtn.addEventListener("click", () => {
      addChapter(chaptersContainer);
    });

    // Wstaw obok sekcji rozdziałów w main
    const main = document.querySelector("main");
    main.insertBefore(addChapterBtn, main.querySelector("section:nth-last-child(2)")); // przed Notatkami Autora
    main.insertBefore(chaptersContainer, main.querySelector("section:nth-last-child(2)")); // przed Notatkami Autora
  }

  // Dodaj nowy rozdział (dynamicznie)
  function addChapter(container, data = null) {
    const chapterIndex = container.children.length;

    const chapterDiv = document.createElement("section");
    chapterDiv.className = "chapter-block";
    chapterDiv.setAttribute("aria-label", `Rozdział ${chapterIndex + 1}`);

    // Nagłówek i przycisk usuń
    const header = document.createElement("h3");
    header.textContent = `Rozdział ${chapterIndex + 1}`;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "Usuń Rozdział";
    removeBtn.style.marginLeft = "1em";
    removeBtn.addEventListener("click", () => {
      container.removeChild(chapterDiv);
      refreshChapterHeaders(container);
    });

    header.appendChild(removeBtn);
    chapterDiv.appendChild(header);

    // Pola rozdziału
    chapterDiv.appendChild(createLabeledInput("chapterTitle", "Tytuł Rozdziału", data?.title || ""));
    chapterDiv.appendChild(createLabeledInput("chapterDate", "Data utworzenia", data?.date || "", "date"));
    chapterDiv.appendChild(createLabeledInput("chapterVersion", "Wersja", data?.version || ""));
    chapterDiv.appendChild(createLabeledSelect("chapterLanguage", "Język", data?.language || "pl"));

    // Kontener fragmentów w rozdziale
    const fragmentsContainer = document.createElement("div");
    fragmentsContainer.className = "fragments-container";
    fragmentsContainer.setAttribute("aria-label", `Fragmenty Rozdziału ${chapterIndex + 1}`);

    // Przycisk dodaj fragment
    const addFragmentBtn = document.createElement("button");
    addFragmentBtn.type = "button";
    addFragmentBtn.textContent = "Dodaj nowy Fragment";
    addFragmentBtn.addEventListener("click", () => {
      addFragment(fragmentsContainer);
    });

    chapterDiv.appendChild(addFragmentBtn);
    chapterDiv.appendChild(fragmentsContainer);

    // Jeśli mamy dane fragmentów, wczytujemy je
    if (data && Array.isArray(data.fragments)) {
      data.fragments.forEach((frag) => addFragment(fragmentsContainer, frag));
    }

    container.appendChild(chapterDiv);
  }

  // Odśwież nagłówki rozdziałów po usunięciu
  function refreshChapterHeaders(container) {
    Array.from(container.children).forEach((chapterDiv, idx) => {
      const h3 = chapterDiv.querySelector("h3");
      if (h3) {
        h3.firstChild.textContent = `Rozdział ${idx + 1}`;
        // aria-label dla fragmentów
        const fragContainer = chapterDiv.querySelector(".fragments-container");
        if (fragContainer) {
          fragContainer.setAttribute("aria-label", `Fragmenty Rozdziału ${idx + 1}`);
        }
      }
    });
  }

  // Dodaj fragment do danego kontenera fragmentów
  function addFragment(container, data = null) {
    const fragmentIndex = container.children.length;

    const fragmentDiv = document.createElement("fieldset");
    fragmentDiv.className = "fragment-block";
    fragmentDiv.setAttribute("aria-label", `Fragment ${fragmentIndex + 1}`);

    // Legenda i przycisk usuń
    const legend = document.createElement("legend");
    legend.textContent = `Fragment ${fragmentIndex + 1}`;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "Usuń Fragment";
    removeBtn.style.marginLeft = "1em";
    removeBtn.addEventListener("click", () => {
      container.removeChild(fragmentDiv);
      refreshFragmentLegends(container);
    });

    legend.appendChild(removeBtn);
    fragmentDiv.appendChild(legend);

    // Pola fragmentu
    fragmentDiv.appendChild(createLabeledInput("fragmentTitle", "Tytuł Fragmentu", data?.title || ""));
    fragmentDiv.appendChild(createLabeledInput("fragmentDate", "Data utworzenia", data?.date || "", "date"));
    fragmentDiv.appendChild(createLabeledInput("fragmentVersion", "Wersja", data?.version || ""));
    fragmentDiv.appendChild(createLabeledSelect("fragmentLanguage", "Język", data?.language || "pl"));
    fragmentDiv.appendChild(createLabeledTextarea("fragmentText", "Tekst Fragmentu", data?.text || ""));

    container.appendChild(fragmentDiv);
  }

  // Odśwież legendy fragmentów po usunięciu
  function refreshFragmentLegends(container) {
    Array.from(container.children).forEach((fragDiv, idx) => {
      const legend = fragDiv.querySelector("legend");
      if (legend) {
        legend.firstChild.textContent = `Fragment ${idx + 1}`;
      }
    });
  }

  // Pomocnicze funkcje tworzenia elementów formularza z etykietą

  function createLabeledInput(baseId, labelText, value = "", type = "text") {
    const wrapper = document.createElement("div");
    wrapper.className = "form-group";

    const id = baseId + "-" + uniqueId();

    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.textContent = labelText;

    const input = document.createElement("input");
    input.type = type;
    input.id = id;
    input.name = baseId;
    input.value = value;

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    return wrapper;
  }

  function createLabeledSelect(baseId, labelText, selectedValue = "pl") {
    const wrapper = document.createElement("div");
    wrapper.className = "form-group";

    const id = baseId + "-" + uniqueId();

    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.textContent = labelText;

    const select = document.createElement("select");
    select.id = id;
    select.name = baseId;

    const options = [
      { value: "pl", text: "Polski" },
      { value: "en", text: "Angielski" },
      { value: "other", text: "Inny" },
    ];

    options.forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt.value;
      option.textContent = opt.text;
      if (opt.value === selectedValue) option.selected = true;
      select.appendChild(option);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    return wrapper;
  }

  function createLabeledTextarea(baseId, labelText, value = "") {
    const wrapper = document.createElement("div");
    wrapper.className = "form-group";

    const id = baseId + "-" + uniqueId();

    const label = document.createElement("label");
    label.setAttribute("for", id);
    label.textContent = labelText;

    const textarea = document.createElement("textarea");
    textarea.id = id;
    textarea.name = baseId;
    textarea.value = value;
    textarea.rows = 6;

    wrapper.appendChild(label);
    wrapper.appendChild(textarea);
    return wrapper;
  }

  // Generuje unikalny id dla inputów
  function uniqueId() {
    return Math.random().toString(16).slice(2, 8);
  }

  // Walidacja całej struktury formularza dynamicznego
  function validateFields() {
    // Uniwersum, Świat, Tom, Notatki i Fabular Switch - statyczne (zakładam, że są w HTML)
    const staticRequired = [
      "universeTitle",
      "universeDate",
      "universeVersion",
      "universeLanguage",
      "worldTitle",
      "worldDate",
      "worldVersion",
      "worldLanguage",
      "volumeTitle",
      "volumeDate",
      "volumeVersion",
      "volumeLanguage",
    ];

    for (const id of staticRequired) {
      const el = document.getElementById(id);
      if (!el || !el.value.trim()) {
        showMessage(`Pole "${getLabelText(el)}" jest wymagane i nie może być puste.`, "error");
        el.focus();
        return false;
      }
    }

    // Rozdziały i ich fragmenty
    const chaptersContainer = document.getElementById("chaptersContainer");
    if (!chaptersContainer || chaptersContainer.children.length === 0) {
      showMessage("Musisz dodać przynajmniej jeden Rozdział.", "error");
      return false;
    }

    for (const chapter of chaptersContainer.children) {
      const inputs = chapter.querySelectorAll("input, select");
      for (const input of inputs) {
        if (!input.value.trim()) {
          showMessage(`Pole "${getLabelText(input)}" w Rozdziale jest wymagane.`, "error");
          input.focus();
          return false;
        }
      }
      // Sprawdź fragmenty
      const fragmentsContainer = chapter.querySelector(".fragments-container");
      if (!fragmentsContainer || fragmentsContainer.children.length === 0) {
        showMessage("Każdy Rozdział musi mieć przynajmniej jeden Fragment.", "error");
        return false;
      }
      for (const fragment of fragmentsContainer.children) {
        const fragInputs = fragment.querySelectorAll("input, select, textarea");
        for (const input of fragInputs) {
          if (!input.value.trim()) {
            showMessage(`Pole "${getLabelText(input)}" w Fragmencie jest wymagane.`, "error");
            input.focus();
            return false;
          }
        }
      }
    }

    // Notatki autora - mogą być puste, więc brak walidacji

    return true;
  }

  // Pomocnik do pobrania labelki
  function getLabelText(el) {
    if (!el) return "Pole";
    if (!el.id) return "Pole";
    const label = document.querySelector(`label[for="${el.id}"]`);
    return label ? label.textContent : el.id;
  }

  // Zbierz dane z formularza do obiektu
  function collectData() {
    const meta = {
      timestamp: new Date().toISOString(),
      fabularGeneration: fabularSwitch.value,
      authorNotes: document.getElementById("authorNotes").value.trim(),
    };

    const universe = {
      title: document.getElementById("universeTitle").value.trim(),
      date: document.getElementById("universeDate").value,
      version: document.getElementById("universeVersion").value.trim(),
      language: document.getElementById("universeLanguage").value,
    };

    const world = {
      title: document.getElementById("worldTitle").value.trim(),
      date: document.getElementById("worldDate").value,
      version: document.getElementById("worldVersion").value.trim(),
      language: document.getElementById("worldLanguage").value,
    };

    const volume = {
      title: document.getElementById("volumeTitle").value.trim(),
      date: document.getElementById("volumeDate").value,
      version: document.getElementById("volumeVersion").value.trim(),
      language: document.getElementById("volumeLanguage").value,
    };

    // Rozdziały i fragmenty
    const chaptersContainer = document.getElementById("chaptersContainer");
    const chapters = [];

    for (const chapterDiv of chaptersContainer.children) {
      const chapter = {};
      chapter.title = chapterDiv.querySelector('input[name="chapterTitle"]').value.trim();
      chapter.date = chapterDiv.querySelector('input[name="chapterDate"]').value;
      chapter.version = chapterDiv.querySelector('input[name="chapterVersion"]').value.trim();
      chapter.language = chapterDiv.querySelector('select[name="chapterLanguage"]').value;

      // Fragmenty
      const fragmentsContainer = chapterDiv.querySelector(".fragments-container");
      const fragments = [];
      for (const fragDiv of fragmentsContainer.children) {
        const fragment = {};
        fragment.title = fragDiv.querySelector('input[name="fragmentTitle"]').value.trim();
        fragment.date = fragDiv.querySelector('input[name="fragmentDate"]').value;
        fragment.version = fragDiv.querySelector('input[name="fragmentVersion"]').value.trim();
        fragment.language = fragDiv.querySelector('select[name="fragmentLanguage"]').value;
        fragment.text = fragDiv.querySelector('textarea[name="fragmentText"]').value.trim();
        fragments.push(fragment);
      }
      chapter.fragments = fragments;
      chapters.push(chapter);
    }

    return {
      meta,
      structure: {
        universe,
        world,
        volume,
        chapters,
      },
    };
  }

  // Zapis do localStorage
  function saveProject() {
    if (!validateFields()) return;

    try {
      const data = collectData();
      let archive = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      archive.push(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(archive));
      showMessage(`Projekt zapisany lokalnie. Timestamp: ${data.meta.timestamp}`, "success");
    } catch (e) {
      showMessage("Błąd zapisu: " + e.message, "error");
    }
  }

  // Załaduj ostatni zapisany projekt
  function loadProject() {
    try {
      let archive = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (archive && archive.length > 0) {
        const last = archive[archive.length - 1];
        fillForm(last);
        showMessage(`Załadowano ostatni projekt z timestampem ${last.meta.timestamp}`, "info");
      }
    } catch {
      // ignoruj błędy
    }
  }

  // Wypełnij formularz danymi (statyczne i dynamiczne)
  function fillForm(data) {
    if (!data || !data.structure) return;
    const s = data.structure;

    document.getElementById("universeTitle").value = s.universe.title || "";
    document.getElementById("universeDate").value = s.universe.date || "";
    document.getElementById("universeVersion").value = s.universe.version || "";
    document.getElementById("universeLanguage").value = s.universe.language || "pl";

    document.getElementById("worldTitle").value = s.world.title || "";
    document.getElementById("worldDate").value = s.world.date || "";
    document.getElementById("worldVersion").value = s.world.version || "";
    document.getElementById("worldLanguage").value = s.world.language || "pl";

    document.getElementById("volumeTitle").value = s.volume.title || "";
    document.getElementById("volumeDate").value = s.volume.date || "";
    document.getElementById("volumeVersion").value = s.volume.version || "";
    document.getElementById("volumeLanguage").value = s.volume.language || "pl";

    // Usuń istniejące rozdziały
    const chaptersContainer = document.getElementById("chaptersContainer");
    chaptersContainer.innerHTML = "";

    if (Array.isArray(s.chapters)) {
      s.chapters.forEach((chapterData) => {
        addChapter(chaptersContainer, chapterData);
      });
    }

    document.getElementById("authorNotes").value = data.meta.authorNotes || "";
  }

  // Eksport do TXT (podobnie jak poprzednio)
  function exportTxt() {
    if (!validateFields()) return;
    const data = collectData();

    let txt = "";
    txt += `ETERNIVERSE PROJECT EXPORT\n`;
    txt += `Timestamp: ${data.meta.timestamp}\n\n`;

    txt += "META:\n";
    txt += `Fabular Generation: ${data.meta.fabularGeneration}\n`;
    txt += `Notatki Autora:\n${data.meta.authorNotes}\n\n`;

    const s = data.structure;

    txt += "UNIWERSUM:\n";
    for (const [k, v] of Object.entries(s.universe)) {
      txt += `k:{k}:k:{v}\n`;
    }
    txt += "\nŚWIAT:\n";
    for (const [k, v] of Object.entries(s.world)) {
      txt += `k:{k}:k:{v}\n`;
    }
    txt += "\nTOM:\n";
    for (const [k, v] of Object.entries(s.volume)) {
      txt += `k:{k}:k:{v}\n`;
    }
    txt += "\nROZDZIAŁY:\n";

    s.chapters.forEach((chap, i) => {
      txt += `Rozdział ${i + 1}:\n`;
      for (const [k, v] of Object.entries(chap)) {
        if (k !== "fragments") {
          txt += `k:{k}:k:{v}\n`;
        }
      }
      txt += "Fragmenty:\n";
      chap.fragments.forEach((frag, j) => {
        txt += `  Fragment ${j + 1}:\n`;
        for (const [fk, fv] of Object.entries(frag)) {
          txt += `    fk:{fk}:fk:{fv}\n`;
        }
      });
      txt += "\n";
    });

    downloadFile("eterniverse_project.txt", txt, "text/plain");
    showMessage("Eksport do pliku .txt zakończony pomyślnie.", "success");
  }

  // Eksport DOCX i PDF podobnie jak w poprzednim kodzie,
  // zmodyfikowane na nową strukturę (możesz rozbudować analogicznie).

  // Funkcja do pobierania plików
  function downloadFile(filename, content, mimeType) {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Ładowanie zewnętrznych bibliotek (jsPDF i docx) - jak poprzednio

  // Public API
  return {
    init,
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  Eterniverse.init();
});
