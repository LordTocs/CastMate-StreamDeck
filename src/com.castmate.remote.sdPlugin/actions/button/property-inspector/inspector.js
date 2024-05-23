/// <reference path="../../../libs/js/property-inspector.js" />
/// <reference path="../../../libs/js/utils.js" />

function getGlobalSettingForm() {
    return document.querySelector('#global-settings');
}

function getButtonSelect() {
    return document.querySelector("#button-select")
}

let globalSettings = {}
let localSettings = {}

const debouncedUpdateButtonSelector = Utils.debounce(150, () => updateButtonSelector())

$PI.onConnected((jsn) => {
    const form = document.querySelector('#property-inspector');
    const globalForm = getGlobalSettingForm();
    const {actionInfo, appInfo, connection, messageType, port, uuid} = jsn;
    const {payload, context} = actionInfo;
    const {settings} = payload;

    localSettings = settings
    Utils.setFormValue(settings, form);
    
    $PI.getGlobalSettings()

    const select = getButtonSelect()

    select.addEventListener("mousedown", (ev) => {
        debouncedUpdateButtonSelector()
    })

    form.addEventListener(
        'input',
        Utils.debounce(150, () => {
            const value = Utils.getFormValue(form);
            localSettings = value
            $PI.setSettings(value);
        })
    );

    globalForm.addEventListener(
        'input',
        Utils.debounce(150, () => {
            const value = Utils.getFormValue(globalForm);
            $PI.setGlobalSettings(value);
        })
    );
});

$PI.onDidReceiveGlobalSettings(({payload}) => {
    console.log('onDidReceiveGlobalSettings', payload);
    const globalForm = getGlobalSettingForm();
    Utils.setFormValue(payload.settings, globalForm)
    globalSettings = payload.settings
    debouncedUpdateButtonSelector()
})

async function getCastMateButtons() {
	try {
		const resp = await fetch(`http://${globalSettings.castMateIp}:${globalSettings.castMatePort}/plugins/remote/buttons`, { method: 'get'})
		const data = await resp.json()
		return data.buttons ?? []
	} catch(err) {
		console.error(err)
		return []
	}
}

/**
 * 
 * @param {HTMLElement} select 
 */
function clearSelect(select) {
    while(select.firstChild) {
        select.removeChild(select.firstChild)
    }
}

/**
 * 
 * @param {HTMLElement} select 
 * @param {string[]} options
 */
function populateSelect(select, options) {
    const unset = document.createElement("option")
    select.appendChild(unset)

    for (const optionStr of options) {
        const option = document.createElement("option")

        option.value = optionStr
        option.innerHTML = optionStr

        select.appendChild(option)
    }
}

async function updateButtonSelector() {
    console.log("Updating CastMate Button List")
    const select = getButtonSelect()
    if (!select) return

    const buttons = await getCastMateButtons()

    clearSelect(select)
    populateSelect(select, buttons)
    //Reset value. Seems like the select can't hold a value it doesn't have an option for.
    //Reset the value from the local settings after we've queried it.
    select.value = localSettings.button


}

