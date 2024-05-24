
# CastMate StreamDeck Plugin

This plugin allows the stream deck software to activate a CastMate remote trigger. Either on a button or inside a multi-action. It forms a useful bridge between the two automation softwares. It is only compatible with CastMate 0.5+.

## Developer Info

### Clone Library

Clone the javascript SDK into the libs folder, don't worry it's gitignored.

```git clone https://github.com/elgatosf/streamdeck-javascript-sdk src/com.castmate.remote.sdPlugin/libs```

### Setup Symlink

Run `SetupSymlink.bat`, it will create a simlink between your dev folder and the stream deck's appdata folder for easy testing.

### Restart StreamDeck Software

To see changes you must restart the StreamDeck software, you can use `StartStreamDeck.bat` to run it from commandline allowing you to easily start and stop it from your coding workspace.

### Debugging Instructions

https://streamdecklabs.com/debugging-your-javascript-plugin/

In HKEY_CURRENT_USER\Software\Elgato Systems GmbH\StreamDeck
Set html_remote_debugging_enabled with DWORD value 1
In something chromium based open http://localhost:23654/ 