import Event from 'events';
import { constants } from './constants.js';
import Controller from './controller.js';
import SocketServer from "./socket.js";

const port = process.env.PORT || 9898;

const socketServer = new SocketServer({ port });
const controller = new Controller({ socketServer })

const eventEmitter = new Event();
const server = await socketServer.initialize(eventEmitter)


console.log('socket server is running at port', server.address().port);

eventEmitter.on(
    constants.event.NEW_USER_CONNECTED,
    controller.onNewConnection.bind(controller)
);