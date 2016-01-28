const { Class } = require('sdk/core/heritage');
const { EventTarget } = require("sdk/event/target");
const { emit:event_emit } = require('sdk/event/core');
const { when:when_unload } = require('sdk/system/unload');


var BaseUI = Class({
    extends: EventTarget,
    initialize: function initialize(options) {
        this.subscribed_events = [];
        EventTarget.prototype.initialize.call(this);
        when_unload(this.unload);
    },
    process_subscribed_events: function process_subscribed_events() {
        // TODO: possible multiple subscriptions here
        if (this.port)
            this.subscribed_events.forEach(event => {
                this.port.on(event, data => {
                    event_emit(this, 'panel-port-' + event, data);
                })
            })
    },
    on: function on(type, listener) {
        if (type.indexOf('panel-port-') == 0) {
            let final_type = type.replace('panel-port-', '');
            if (this.subscribed_events.indexOf(final_type) < 0) {
                this.subscribed_events.push(final_type);
                this.process_subscribed_events();
            }
        }
        EventTarget.prototype.on.call(this, type, listener);
    },
    emit: function emit(type, message) {
        if (this.port)
            this.port.emit(type, message);
        else
            throw new Error('emit called too early, no panel port available');
    },
    hide: function hide() {
        throw new Error('not implemented');
    },
    unload: function unload() {

    }
});
exports.BaseUI = BaseUI;