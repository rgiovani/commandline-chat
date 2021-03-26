import blessed from 'blessed';

export default class ComponentsBuilder {
    #screen;
    #layout;
    #input;
    #chat;
    #status;
    #activityLog;

    constructor() { }

    #baseComponent() {
        return {
            border: 'line',
            mouse: true,
            keys: true,
            top: 0,
            scrollbar: {
                ch: ' ',
                inverse: true
            },
            //allows you to place colors and tags in texts
            tags: true
        };
    }

    #drawList(parent, align, width, height, items, style) {
        return blessed.list({
            ...this.#baseComponent(),
            parent: parent,
            align: align,
            width: width,
            height: height,
            items: [items],
            style: style || {}
        });
    }

    setScreen({ title }) {
        this.#screen = blessed.screen({
            smartCSR: true,
            title
        });

        this.#screen.key(['escape', 'C-c'], () => process.exit(0)); //C-c : ctrl+c
        return this;
    }

    setLayoutComponent() {
        this.#layout = blessed.layout({
            parent: this.#screen,
            width: '100%',
            height: '100%'
        });

        return this;
    }

    setInputComponent(onEnterPressed) {
        const input = blessed.textarea({
            parent: this.#screen,
            bottom: 0,
            height: '10%',
            inputOnFocus: true,
            padding: {
                top: 1,
                left: 2
            },
            style: {
                fg: '#f6f6f6',
                bg: '#353535'
            }
        });

        input.key('enter', onEnterPressed);
        this.#input = input;

        return this;
    }

    setChatComponent() {
        this.#chat = this.#drawList(this.#layout, 'left', '50%', '90%', '{bold}Messenger{/}');
        return this;
    }

    setStatusComponent() {
        this.#status = this.#drawList(this.#layout, 'left', '25%', '90%', '{bold}Users on Room{/}');
        return this;
    }

    setActivityLogComponent() {
        this.#activityLog = this.#drawList(this.#layout, 'left', '25%', '90%', '{bold}Activity Log{/}', { fg: 'yellow' });
        return this;
    }

    build() {
        const components = {
            screen: this.#screen,
            input: this.#input,
            chat: this.#chat,
            status: this.#status,
            activityLog: this.#activityLog
        };

        return components;
    }
}