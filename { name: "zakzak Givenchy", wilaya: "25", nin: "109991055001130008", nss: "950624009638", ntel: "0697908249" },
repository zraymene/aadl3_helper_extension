# AADL3 Helper Extension
AADL3 Helper Extension is an open-source Chrome extension which automates the registration process of the AADL3 housing program. 

> [!CAUTION]
> The purpose of this extension is to minimize the time spent on the website (auto filling) & lowering the rates of errors while typing. The extension mimics the human actions of refreshing and input filling only, by using the public API of [Chrome Extension](https://developer.chrome.com/docs/extensions) which allows the enhancing of the browsing experience. It doesn't communicate in any means with the website nor it tries to exploit any vulnerability. 

<p align="center">
  <img height="460" src="res/extension_preview.PNG">
</p>

## Features:

- Load a pre-defined list of credentials of multiple individuals and the ability to manage them individually or in bulk.
- Opens a new tab assigned to each entry and keeps refreshing until there is a response from the server.
- Notification on a successful load (no need to keep checking)
- Automatically opens a session (clicks on the orange box)
-  Automatically fills the form (**Wilaya**, **NIN**, **NSS** and **Telephone**) from the entry which was assigned to the tab.
- Multi-language support (English, French and Arabic)

## Note:

-  Input validation doesn't get triggered automatically. However, that won't block the submission of the form. So no further action is required. [#2](https://github.com/zraymene/aadl3_helper_extension/issues/2)

## How to install:
The extension must be loaded on Developer mode. First, Download and unzip the project from Github page: `Code > Download ZIP`. Then follow  these steps provided by [Chrome Official Docs](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world):

```
1. Go to the Extensions page by entering `chrome://extensions` in a new tab. (By design chrome:// URLs are not linkable.)
	- Alternatively, click the Extensions menu puzzle button and select Manage Extensions at the bottom of the menu.
	- Or, click the Chrome menu, hover over More Tools, then select Extensions.
2. Enable Developer Mode by clicking the toggle switch next to Developer mode.
3. Click the Load unpacked button and select the extension directory. 
```
If the steps were followed correctly, the extension will pop on the list as follows:

<p align="center">
  <img width="460" src="res/extension_dev.PNG">
</p>

## How to use:
1. First, you must define the list of credentials. Create a `.txt` or modify the example file named `exemple_entries.txt`:
```
NOM: USER 1
WIL: 16
NIN: 999999999999999988
NSS: 8888888888867
TEL: 0123456789

NOM: USER 2
WIL: 1
NIN: 777777777777777779
NSS: 4444444444441
TEL: 0123456789
```
2. Open the extension and upload the entries file. The list of entries will be generated:
<p align="center">
  <img height="400" src="res/extension_loaded_entries.PNG">
</p>

3. Now you have the option to launch all entries or individually.

4. Now wait until the server respond. When it does, you will be notified and the tab will be activated.
