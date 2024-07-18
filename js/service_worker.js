const url = "https://www.aadl3inscription2024.dz/";

// On extension installation or update
chrome.runtime.onInstalled.addListener(details => {
    console.log("Extension installed or updated.");
    persistEntries([]);
});

// Listen to network errors and filter them
chrome.webRequest.onErrorOccurred.addListener(onNetworkError, { urls: [url + "*"] });

function onNetworkError(details) {
    loadEntries(entries => {
        const targetEntry = getEntryByTabID(entries, details.tabId);
        if (!targetEntry || !targetEntry.running || details.method !== "GET") return;

        // Reload tab on network error
        chrome.tabs.reload(details.tabId)
            .then(() => console.log(`Reloaded tab: ${targetEntry.name}`))
            .catch(() => {
                console.log(`Failed to reload tab: ${targetEntry.name}. Stopping it.`);
                targetEntry.running = false;
                targetEntry.tab_id = -1;
                persistEntries(entries);
            });
    });
}

// When page is successfully loaded
chrome.webNavigation.onCompleted.addListener(onSuccess, { urls: [url] });

function onSuccess(details) {
    loadEntries(entries => {
        const targetEntry = getEntryByTabID(entries, details.tabId);
        if (!targetEntry) return;

        // Mark entry as successfully loaded
        targetEntry.running = false;
        targetEntry.success = true;
        persistEntries(entries);

        // Create notification
        chrome.notifications.create(`AADL3 - ${targetEntry.name}`, {
            iconUrl: "images.jpeg",
            title: `AADL3 - ${targetEntry.name}`,
            message: `AADL3 - ${targetEntry.name}`,
            type: "basic"
        });

        // Set tab as active
        chrome.tabs.update(targetEntry.tab_id, { active: true });

        console.log(`Tab '${targetEntry.name}' loaded.`);
        
        // Inject content script
        chrome.scripting.executeScript({
            target: { tabId: targetEntry.tab_id },
            func: fillForms,
            args: [targetEntry]
        });
    });
}

// Handle closed tabs
chrome.tabs.onRemoved.addListener((tabId) => {
    loadEntries(entries => {
        const index = entries.findIndex(entry => entry.tab_id === tabId);
        if (index !== -1) {
            entries[index].running = false;
            entries[index].tab_id = -1;
            persistEntries(entries);
        }
    });
});

// Function to fill forms
function fillForms(entry) {
    document.title = entry.name;

    // Click on the button
    const orange_button = document.getElementById("A14");
    if (orange_button) {
        orange_button.click();
        console.log("Clicked!");
    }

    // Wait 1 sec before filling form fields
    setTimeout(() => {
        const select_wilaya = document.getElementById("A17");
        const input_nin = document.getElementById("A22");
        const input_nss = document.getElementById("A27");
        const input_telephone = document.getElementById("A13");

        if (input_nin && input_nss && input_telephone) {
            input_nin.value = entry.nin;
            input_nss.value = entry.nss;
            input_telephone.value = entry.tel;
            console.log("Form filled!");
        }
    }, 1000);
}

// Utility functions
function getEntryByTabID(entries, tab_id) {
    return entries.find(entry => entry.tab_id === tab_id);
}

function loadEntries(callback) {
    chrome.storage.local.get(["entries"], result => {
        const entries = result.entries || [];
        callback(entries);
    });
}

function persistEntries(entries) {
    chrome.storage.local.set({ entries });
}
