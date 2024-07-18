const LANG_TABLE = {
    en: {
        LANGUAGE: "Language :",
        LOAD_ENTRIES: "Load entries :",
        ENTRIES_LIST: "Entries list:",
        START_ALL: "Start all",
        STOP_ALL: "Stop all",
        VIEW: "Open",
        START: "Start",
        STOP: "Stop",
    },
    fr: {
        LANGUAGE: "Langue :",
        LOAD_ENTRIES: "Charger les entrées :",
        ENTRIES_LIST: "Liste des entrées:",
        START_ALL: "Lancer tout",
        STOP_ALL: "Arrêter tous",
        VIEW: "Ouvrir",
        START: "Lancer",
        STOP: "Arrêter",
    },
    ar: {
        LANGUAGE: "الغة :",
        LOAD_ENTRIES: "تحميل الإدخالات :",
        ENTRIES_LIST: "قائمة الإدخالات :",
        START_ALL: "بدا الجميع",
        STOP_ALL: "توقيف الجميع",
        VIEW: "افتح",
        START: "ابدا",
        STOP: "توقف",
    },
};

let langId = "fr"; // default
const languageSelect = document.getElementById("language_selection");

chrome.storage.local.get(["language"], (result) => {
    langId = result.language || "fr";
    languageSelect.value = langId;
    changeLanguage(langId);
});

languageSelect.onchange = (e) => changeLanguage(e.target.value);

function changeLanguage(newLangId) {
    langId = newLangId;
    chrome.storage.local.set({ language: newLangId });

    document.querySelectorAll("[data-trans]").forEach((ele) => {
        ele.innerHTML = translate(ele.dataset.trans);
    });

    document.body.style.direction = newLangId === "ar" ? "rtl" : "ltr";
    if (newLangId === "ar") {
        document.querySelector("ol").style.direction = "ltr";
    }
}

function translate(transId) {
    return LANG_TABLE[langId][transId];
}
