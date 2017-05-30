
'use strict';

const $ = require('jquery');
const Backbone = require('backbone');
Backbone.$ = $;

const Settings = Backbone.Model.extend({

    initialize(args) {
        this._settings = {};
        let coms = this.attributes.coms;
        coms.on('broadcast', (broadcast) => this._onSettingsReceived(broadcast));
    },

    defaults: {
        coms: null,
        recents: [ ],
        examples: [ ],
        modules: [ ],
    },

    retrieve(instanceId) {

        let coms = this.attributes.coms;
        let settings = new coms.Messages.SettingsRequest();
        let request = new coms.Messages.ComsMessage();
        request.payload = settings.toArrayBuffer();
        request.payloadType = 'SettingsRequest';
        request.instanceId = instanceId;

        return coms.send(request).then(response => {
            this._onSettingsReceived(response);
        });
    },

    _onSettingsReceived(message) {
        if (message.payloadType !== 'SettingsResponse')
            return;

        let coms = this.attributes.coms;
        let settingsPB = coms.Messages.SettingsResponse.decode(message.payload);
        this.set('recents',  settingsPB.recents);
        this.set('examples', settingsPB.examples);
        this.set('modules', settingsPB.modules);
    },

    setSetting(name, value) {
        if (this._settings[name] === value)
            return;
        this._settings[name] = value;
        this.trigger('change:' + name, value);
    },

    getSetting(name) {
        return this._settings[name];
    },

});

module.exports = Settings;
