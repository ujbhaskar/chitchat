// import io from 'socket.io-client';

//npm i @types/socket.io-client

import * as io from 'socket.io-client';
export const socket = io('http://10.141.154.38:3000', {transports: ['websocket', 'polling', 'flashsocket']});