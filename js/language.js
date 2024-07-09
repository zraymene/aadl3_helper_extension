
const LANG_TABLE = {
    // English
    "en": {
        LANGAUGE:     "Language :",
        LOAD_ENTRIES: "Load entries :",
        ENTRIES_LIST: "Entries list:",
        START_ALL:    "Start all",
        STOP_ALL:     "Stop all",
        VIEW:         "Open",
        START:        "Start",
        STOP:         "Stop",
    },

    // French
    "fr": {
        LANGAUGE:     "Langue :",
        LOAD_ENTRIES: "Charger les entrées :",
        ENTRIES_LIST: "Liste des entrées:",
        START_ALL:    "Lancer tout",
        STOP_ALL:     "Arrêter tous",
        VIEW:         "Ouvrir",
        START:        "Lancer",
        STOP:         "Arrêtr",
    },

    // Arabic
    "ar": {
        LANGAUGE:     "الغة :",
        LOAD_ENTRIES: "تحميل الإدخالات :",
        ENTRIES_LIST: "قائمة الإدخالات :",
        START_ALL:    "بدا الجميع",
        STOP_ALL:     "توقيف الجميع",
        VIEW:         "افتح",
        START:        "ابدا",
        STOP:         "توقف",
    },
};

let lang_id = "fr"; // default
const language_select = document.getElementById( "langauge_selection" )

chrome.storage.local.get( ["language"], (result) => {
    let new_lang_id = "fr";
    if( result.language !== undefined )
        new_lang_id = result.language;

    language_select.value = new_lang_id; // update select option 
    ChangeLanguage( new_lang_id );
} );

language_select.onchange = (e) => ChangeLanguage( e.target.value ) 

function ChangeLanguage( new_lang_id ) {
    // presist data
    lang_id = new_lang_id;
    chrome.storage.local.set( { language: new_lang_id } );

    // apply change
    let elements = document.querySelectorAll( "[data-trans]" );
    for( ele of elements )
        ele.innerHTML = TRANSLATE( ele.dataset.trans ) 

    // text direction
    if( new_lang_id === "ar" ) {
        // the whole body except "ol" container
        document.body.style.direction = "rtl";   
        document.getElementsByTagName( "ol" )[0].style.direction = "ltr"
    } else 
        document.body.style.direction = "ltr";   
}

function TRANSLATE( trans_id ) {
    return LANG_TABLE[ lang_id ][ trans_id ];
}