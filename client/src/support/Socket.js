import { io } from 'socket.io-client';
import { BACKEND } from './Constants';

const socket = io(BACKEND)

export const joinToRoom = (room, payload) => {
  socket.emit('join', { room, payload })
}

export const leaveFromRoom = (room, payload) => {
  socket.emit('leave', { room, payload })
}

export default socket;
