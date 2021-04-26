import { io } from 'socket.io-client';
import { BACKEND } from './Constants';

const socket = io(BACKEND)

export const joinToRoom = (room, payload) => {
  socket.emit('join', { room, payload })
}

export const leaveFromRoom = (room) => {
  socket.emit('leave', { room })
}

export default socket;
