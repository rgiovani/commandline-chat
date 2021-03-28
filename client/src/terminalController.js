import ComponentsBuilder from "./components.js";
import { constants } from "./constants.js";

export default class TerminalController {
    #usersCollors = new Map();
    constructor() { }

    #pickColor() {
        return `#${((1 << 24) * Math.random() | 0).toString(16)}-fg`;
    }

    #getUserColor(userName) {
        if (this.#usersCollors.has(userName))
            return this.#usersCollors.get(userName);

        const collor = this.#pickColor();
        this.#usersCollors.set(userName, collor);

        return collor;
    }

    #onInputReceived(eventEmitter) {
        return function () {
            const message = this.getValue();
            eventEmitter.emit(constants.events.app.MESSAGE_SENT, message);
            this.clearValue();
        };
    }

    #onMessageReceived({ screen, chat }) {
        return msg => {
            const { userName, message } = msg;
            const color = this.#getUserColor(userName);
            chat.addItem(`({${color}}{bold}${userName}{/}): ${message}`);
            screen.render();
        };
    }

    #onLogChanged({ screen, activityLog }) {
        return msg => {
            const [userName] = msg.split(/\s/);
            const color = this.#getUserColor(userName);
            activityLog.addItem(`{${color}} {bold}${msg.toString()}{/}`);
            screen.render();
        };
    }

    #onStatusChanged({ screen, status }) {
        return users => {
            const { content } = status.items.shift();

            status.clearItems();
            status.addItem(content);

            users.forEach(userName => {
                const color = this.#getUserColor(userName);
                status.addItem(`{${color}}{bold}${userName}{/}`);
            })

            screen.render();
        };
    }

    #registerEvents(eventEmitter, components) {
        eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components));
        eventEmitter.on(constants.events.app.ACTIVITYLOG_UPDATED, this.#onLogChanged(components));
        eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusChanged(components));
    }

    async initializeTable(eventEmitter) {
        const components = new ComponentsBuilder()
            .setScreen({ title: constants.events.app.TITLE })
            .setLayoutComponent()
            .setInputComponent(this.#onInputReceived(eventEmitter))
            .setChatComponent()
            .setStatusComponent()
            .setActivityLogComponent()
            .build();

        this.#registerEvents(eventEmitter, components);

        components.input.focus();
        components.screen.render();

        // setInterval(() => {
        //     eventEmitter.emit(constants.events.app.MESSAGE_RECEIVED, { userName: 'ronaldo', message: 'hey' })
        // }, 2000)
    }
}