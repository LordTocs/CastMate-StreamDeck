/// <reference path="../../../libs/js/property-inspector.js" />
/// <reference path="../../../libs/js/utils.js" />

function getGlobalSettingForm() {
    return document.querySelector('#global-settings');
}

let globalSettings = {}

$PI.onConnected((jsn) => {
    const form = document.querySelector('#property-inspector');
    const globalForm = getGlobalSettingForm();
    const {actionInfo, appInfo, connection, messageType, port, uuid} = jsn;
    const {payload, context} = actionInfo;
    const {settings} = payload;

    Utils.setFormValue(settings, form);
    
    $PI.getGlobalSettings()

    form.addEventListener(
        'input',
        Utils.debounce(150, () => {
            const value = Utils.getFormValue(form);
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
})

/**
 * Provide window level functions to use in the external window
 * (this can be removed if the external window is not used)
 */
window.sendToInspector = (data) => {
    console.log(data);
};

document.querySelector('#open-external').addEventListener('click', () => {
    window.open('../../../external.html');
});

