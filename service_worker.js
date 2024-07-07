//const url = "https://aadl3inscription2024.dz/";
const url = "http://localhost:8000/";

// listen to network errors and filter them
chrome.webRequest.onErrorOccurred.addListener( onNetworkError, { urls: [url, url + "    */"] } );
function onNetworkError( details ) {
    LoadEntries( (entries) => {

        // is it from the concerned tabs ?
        let target_entry = GetEntryByTabID( entries, details.tabId );
        if( target_entry === null ) 
            return;

        // is the entry still running
        if( !target_entry.running )
            return;

        // we care only about page loading
        if( details.method !== "GET" )
            return;

        // reload tab
        chrome.tabs.reload( details.tabId )
        .then( (e) => console.log( "Reloading tab: " + target_entry.name ) )
        .catch( (e) => {
            console.log( "Tried to close: " + target_entry.name + ". Stopping it." );

            target_entry.running = false;
            target_entry.tab_id = -1;
            
            PresistEntries( entries );
        } );
    } )
}

chrome.webNavigation.onCompleted.addListener( onSuccess, { urls: [url] } )
function onSuccess( details ) {
    LoadEntries( (entries) => {

        // is it from the concerned tabs ?
        let target_entry = GetEntryByTabID( entries, details.tabId );
        if( target_entry === null ) 
            return;

        // stop it from refreshing
        target_entry.running = false;
        PresistEntries( entries );

        // notification
        chrome.notifications.create( "AADL3, " + target_entry.name, { 
            iconUrl: "images.jpeg", 
            title:  "AADL3, " + target_entry.name,
            message: "AADL3, " + target_entry.name,
            type: "basic"
        } )

        // set it as active
        chrome.tabs.update( target_entry.tab_id, { selected: true } )

        console.log( "Tab: " + target_entry.name + " - loaded !" );

        // inject content script 
        chrome.scripting.executeScript( {
            target: { tabId: target_entry.tab_id },
            func:   FillForms,
            args:   [ target_entry ]
        })
    } )
}

// delete closed tabs
chrome.tabs.onRemoved.addListener( (tabId, _ ) => {
    LoadEntries( (entries) => {
        for( entry of entries ) {
            if( tabId === entry.tab_id ) {
                entry.running = false;
                entry.tab_id  = -1;

                PresistEntries( entries );
            }         
        }
    } )
} )

// --------- Injected JS code ----------
function FillForms( entry ) {
    document.title = entry.name;

    setInterval( ()  => {
        // enable back: copy, cut, paste anc context menu
        document.body.oncontextmenu  = null
        document.body.oncopy  = null
        document.body.oncut   = null
        document.body.onpaste = null
    }, 500)


    console.log(   document.body.oncontextmenu )

    const select_wilaya   = document.getElementById( "A17" );
    const input_nin       = document.getElementById( "A22" );
    const input_nss       = document.getElementById( "A27" );
    const input_telephone = document.getElementById( "A13" );
    //const accept_checkbox = document.getElementById( "A91_1" );

    input_nin.oncontextmenu = null;

    console.log( input_nin )
    console.log( input_nss )
    console.log( input_telephone )

    // change values
    select_wilaya.value   = parseInt( entry.wilaya ) + 1;
    input_nin.value       = entry.nin;
    input_nss.value       = entry.nss;
    input_telephone.value = entry.telephone;


}

// --------- Storage utility ----------
function LoadEntries( callback ) {
    chrome.storage.session.get( ["entries"], 
        (result) =>  { 
            let entries = result.entries
            if( entries === null ) 
                return;

            callback( entries );
    });
}
function PresistEntries( entries ) {
    chrome.storage.session.set( {
        entries: entries
    } )    
}

function GetEntryByTabID( entries, tab_id ) {
    for( entry of entries )
        if( entry.tab_id === tab_id )
            return entry;
}