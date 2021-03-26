//map the events that come from the socket
export default class Controller {
    #users = new Map();

    constructor({ socketServer }) {
        this.socketServer = socketServer;
    }

    onNewConnection(socket) {
        const { id } = socket;
        console.log('connection stablished with', id);
        const userData = { id, socket }
        this.#updateGlobalUserData(id, userData);

        socket.on('data', this.#onSocketData(id));
        socket.on('error', this.#onSocketError(id));
        socket.on('end', this.#onSocketClosed(id));
    }

    #onSocketData(id) {
        return data => {
            console.log('onSocketData', data.toString());
        }
    }

    #onSocketClosed(id) {
        return data => {
            console.log('onSocketClosed', data.toString());
        }
    }

    #onSocketError(id) {
        return data => {
            console.log('onSocketError', data.toString());
        }
    }

    #updateGlobalUserData(socketId, userData) {
        const users = this.#users;
        const user = users.get(socketId) ?? {};

        const updateUserData = {
            ...user,
            ...userData
        }

        users.set(socketId, updateUserData)

        return users.get(socketId);
    }
}