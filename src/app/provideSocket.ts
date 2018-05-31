// import io from 'socket.io-client';

//npm i @types/socket.io-client

import * as io from 'socket.io-client';
export const socket = io('http://127.0.0.1:3000', {transports: ['websocket', 'polling', 'flashsocket']});