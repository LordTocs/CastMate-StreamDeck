/// <reference path="libs/js/action.js" />
/// <reference path="libs/js/stream-deck.js" />

const myAction = new Action('com.castmate.remote.button');

let globalSettings = {}

/**
 * The first event fired when Stream Deck starts
 */
$SD.onConnected(({ actionInfo, appInfo, connection, messageType, port, uuid }) => {
	console.log('Stream Deck connected!');

	$SD.getGlobalSettings()
});

$SD.onDidReceiveGlobalSettings(({ payload }) => {
	let needsSave = false
	console.log("Global Settings Payload!", payload)

	let settings = payload.settings ?? {}

	if (!("castMateIp" in settings)) {
		settings.castMateIp = "127.0.0.1"
		needsSave = true
		console.log("No IP in global settings")
	}

	if (!("castMatePort" in settings)) {
		settings.castMatePort = "8181"
		needsSave = true
		console.log("No port in global settings")
	}

	if (needsSave) {
		console.log("Setting Default Global Settings", settings)
		$SD.setGlobalSettings(settings)
	}

	globalSettings = settings
})

myAction.onKeyUp(({ action, context, device, event, payload }) => {
	console.log("Key Up", action, context, device, event, payload)
	if (action == "com.castmate.remote.button") {
		const settings = payload.settings

		fetch(`http://${globalSettings.castMateIp}:${globalSettings.castMatePort}/plugins/remote/buttons/press?${new URLSearchParams({ button: settings.button })}`, { method: "post" })
	}
});

