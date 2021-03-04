import { io } from 'socket.io-client';
import { BACKEND } from './Constants';

const socket = io(BACKEND)

export const joinToRoom = (room) => {
  socket.emit('join', { room })
}

export const leaveFromRoom = (room) => {
  socket.emit('leave', { room })
}

export default socket;
