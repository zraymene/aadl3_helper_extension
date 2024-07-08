let entries = [];
function NewEntry( name ) {
    let entry = {
        name:      name,
        wilaya:    '0',
        nin:       '0',
        nss:       '0',
        telephone: '0',

        tab_id:     -1,
        running:    false,
        success:    false,
    }

    entries.push( entry );
    return entry;
}

// read/parse entries file
document.querySelector( "input[type=file]" ).onchange = async (e) => {
    // read
    const file = e.target.files.item( 0 );
    const text = await file.text();

    // parse
    entries.length = 0; // reset
    const lines = text.split( '\n' );
    let current_entry;
    for( line of lines )
    {
        // ignore empty lines
        if( line.trim().length === 0  )
            continue;

        let splits = line.split( ':' );
        let title  = splits[0].trim().toUpperCase();       
        let data   = splits[1].trim().toUpperCase();       
        switch( title ) {
            case "NOM":
                current_entry = NewEntry( data );
                break;
            case "WIL":
                current_entry.wilaya = data;
                break;
            case "NIN":
                current_entry.nin = data;
                break;
            case "NSS":
                current_entry.nss = data;
                break;
            case "TEL":
                current_entry.tel = data;
                break;

            default:
                console.error( "Line title unknown : " + title )
        }
    }

    // push to DOM
    UpdateUI();
    PresistEntries();
}

// when popup is re-oppened
chrome.storage.session.get( ["entries"], (result) => {
    if( result.entries === undefined )
        return;

    entries = result.entries;
    UpdateUI();
}) 

const start_all_btn = document.getElementById( "start_all_btn" );
const stop_all_btn  = document.getElementById( "stop_all_btn" );

start_all_btn.onclick = (e) => {
    for( entry of entries )
        if( !entry.running )
            StartTask( entry )
}
stop_all_btn.onclick = (e) => {
    for( entry of entries )
        if( entry.running )
            StopTask( entry )
}

function UpdateUI() {
    let atleast_one_running = false;
    let atleast_one_stopped = false;

    const ol = document.getElementsByTagName( "ol" )[0];
    ol.innerHTML = ''; // clear

    for( const [i, entry] of entries.entries() ) 
    {
        /*
            <li>
                <span>ZEROUAL Aymene</span>
                <button>VIEW</button>
                <button>START</button>
                <button>STOP</button>
            </li>
            <hr>
        */
        const view_btn = document.createElement( "button" );
        view_btn.innerHTML = "VIEW";
        view_btn.disabled  = ( entry.tab_id === -1 )? true : false;
        
        const span = document.createElement( "span" );
        span.innerHTML = entry.name;
        
        let name_state_class = "running";
        if( entry.success )
            name_state_class = "success";
        else if( !entry.running )
            name_state_class = "stopped";
        span.classList.add( name_state_class )

        const start_btn = document.createElement( "button" );
        start_btn.innerHTML = "START";
        start_btn.id        = "start_btn_" + i; 
        start_btn.disabled  = entry.running;
        start_btn.classList.add( "start" );

        const stop_btn = document.createElement( "button" );
        stop_btn.innerHTML = "STOP";
        stop_btn.id        = "stop_btn_" + i; 
        stop_btn.disabled  = !entry.running;
        stop_btn.classList.add( "stop" );

        const li = document.createElement( "li" );
        li.appendChild( span );
        li.appendChild( view_btn );
        li.appendChild( start_btn );
        li.appendChild( stop_btn );

        ol.appendChild( li );
        ol.appendChild( document.createElement( "hr" ) );

        if( entry.running )
            atleast_one_running = true;
        else    
            atleast_one_stopped = true;

        // events
        view_btn.onclick  = (e) => chrome.tabs.update( entry.tab_id, { selected: true } )
        start_btn.onclick = (e) => StartTask( entry );
        stop_btn.onclick  = (e) => StopTask( entry );
    }

    // stop/start all buttons
    if( atleast_one_running ) 
        stop_all_btn.disabled = false;
    else
        stop_all_btn.disabled = true;

    if( atleast_one_stopped ) 
        start_all_btn.disabled = false;
    else
        start_all_btn.disabled = true;
}
 
const url = "https://www.aadl3inscription2024.dz/";
//const url = "http://localhost:8000/";
function StartTask( entry ) {
    entry.running = true;
    entry.success = false;

    // tab already open just reload it
    if( entry.tab_id !== -1 ) {
        chrome.tabs.reload( entry.tab_id );

        PresistEntries();
        UpdateUI();
    } else {
        chrome.tabs.create( {
            active: false,
            url:    url
        } ).then( (tab) => {
            entry.tab_id  = tab.id;

            PresistEntries();
            UpdateUI();
        } );
    }
}

function StopTask( entry ) {
    entry.running = false;
    PresistEntries()
    UpdateUI();
}

function PresistEntries() {
    chrome.storage.session.set( {
        entries: entries
    } )    
}