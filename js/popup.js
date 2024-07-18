let entries = [];

function NewEntry(name) {
    return {
        name: name,
        wilaya: '0',
        nin: '0',
        nss: '0',
        telephone: '0',
        tab_id: -1,
        running: false,
        success: false,
    };
}

document.querySelector("input[type=file]").onchange = handleFileChange;

chrome.storage.session.get(["entries"], (result) => {
    if (result.entries !== undefined) {
        entries = result.entries;
        UpdateUI();
    }
});

const start_all_btn = document.getElementById("start_all_btn");
const stop_all_btn = document.getElementById("stop_all_btn");

start_all_btn.onclick = () => {
    entries.forEach((entry) => {
        if (!entry.running) {
            StartTask(entry);
        }
    });
};

stop_all_btn.onclick = () => {
    entries.forEach((entry) => {
        if (entry.running) {
            StopTask(entry);
        }
    });
};

function handleFileChange(e) {
    const file = e.target.files.item(0);
    file && readFile(file);
}

async function readFile(file) {
    const text = await file.text();
    parseEntries(text);
}

function parseEntries(text) {
    entries = [];
    const lines = text.split('\n');
    let current_entry;

    for (const line of lines) {
        if (line.trim().length === 0) continue;

        const [title, data] = line.split(':').map(part => part.trim().toUpperCase());
        
        switch (title) {
            case "NOM":
                current_entry = NewEntry(data);
                entries.push(current_entry);
                break;
            case "WIL":
            case "NIN":
            case "NSS":
            case "TEL":
                current_entry && (current_entry[title.toLowerCase()] = data);
                break;
            default:
                console.error(`Unknown line title: ${title}`);
        }
    }

    UpdateUI();
    PresistEntries();
}

function UpdateUI() {
    const ol = document.querySelector("ol");
    ol.innerHTML = "";

    entries.forEach((entry, i) => {
        const li = createEntryListItem(entry, i);
        ol.appendChild(li);
        ol.appendChild(document.createElement("hr"));
    });

    const atleast_one_running = entries.some(entry => entry.running);
    const atleast_one_stopped = entries.some(entry => !entry.running);

    stop_all_btn.disabled = !atleast_one_running;
    start_all_btn.disabled = !atleast_one_stopped;
}

function createEntryListItem(entry, index) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = entry.name;

    const view_btn = createButton("VIEW", () => chrome.tabs.update(entry.tab_id, { selected: true }), entry.tab_id === -1);
    const start_btn = createButton("START", () => StartTask(entry), entry.running);
    const stop_btn = createButton("STOP", () => StopTask(entry), !entry.running);

    li.appendChild(span);
    li.appendChild(view_btn);
    li.appendChild(start_btn);
    li.appendChild(stop_btn);

    return li;
}

function createButton(label, onClick, disabled) {
    const button = document.createElement("button");
    button.dataset.trans = label.toUpperCase();
    button.innerHTML = TRANSLATE(label.toUpperCase());
    button.disabled = disabled;
    button.addEventListener("click", onClick);
    button.classList.add(label.toLowerCase());
    return button;
}

const url = "https://www.aadl3inscription2024.dz/";

function StartTask(entry) {
    entry.running = true;
    entry.success = false;

    if (entry.tab_id !== -1) {
        chrome.tabs.reload(entry.tab_id, () => {
            PresistEntries();
            UpdateUI();
        });
    } else {
        chrome.tabs.create({ active: false, url }, (tab) => {
            entry.tab_id = tab.id;
            PresistEntries();
            UpdateUI();
        });
    }
}

function StopTask(entry) {
    entry.running = false;
    PresistEntries();
    UpdateUI();
}

function PresistEntries() {
    chrome.storage.session.set({ entries });
}

document.querySelector("svg").onclick = () => chrome.tabs.create({ url: "https://www.github.com/zraymene" });
