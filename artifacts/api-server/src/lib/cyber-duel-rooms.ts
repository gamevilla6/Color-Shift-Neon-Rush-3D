import { randomBytes, randomInt } from "node:crypto";

export type CyberDuelAction = "left" | "right" | "color";
export type CyberDuelStatus = "waiting" | "ready" | "running" | "over";

export interface CyberDuelEvent {
  id: number;
  playerIndex: 0 | 1;
  action: CyberDuelAction;
}

export interface CyberDuelPlayerPresence {
  playerIndex: 0 | 1;
  connected: boolean;
  ready: boolean;
}

export interface CyberDuelRoomState {
  roomCode: string;
  status: CyberDuelStatus;
  players: CyberDuelPlayerPresence[];
  events: CyberDuelEvent[];
  eventCursor: number;
  snapshot: Record<string, unknown> | null;
  winnerIndex: 0 | 1 | null;
}

export interface CyberDuelRoomSession extends CyberDuelRoomState {
  token: string;
  playerIndex: 0 | 1;
}

interface RoomSeat {
  token: string;
  lastSeenAt: number;
}

interface Room {
  roomCode: string;
  createdAt: number;
  updatedAt: number;
  status: CyberDuelStatus;
  seats: [RoomSeat | null, RoomSeat | null];
  events: CyberDuelEvent[];
  eventCursor: number;
  snapshot: Record<string, unknown> | null;
  winnerIndex: 0 | 1 | null;
}

export class CyberDuelRoomError extends Error {
  constructor(
    readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "CyberDuelRoomError";
  }
}

const ROOM_TTL_MS = 15 * 60 * 1000;
const PRESENCE_TIMEOUT_MS = 8 * 1000;
const MAX_ROOMS = 1000;
const MAX_ROOM_EVENTS = 240;
const MAX_SNAPSHOT_BYTES = 48_000;
const rooms = new Map<string, Room>();

function removeExpiredRooms(now: number): void {
  for (const [roomCode, room] of rooms) {
    if (now - room.updatedAt > ROOM_TTL_MS) rooms.delete(roomCode);
  }
}

function active(room: Room, index: 0 | 1, now = Date.now()): boolean {
  const seat = room.seats[index];
  return Boolean(seat && now - seat.lastSeenAt <= PRESENCE_TIMEOUT_MS);
}

function refreshWaitingStatus(room: Room, now = Date.now()): void {
  if (room.status === "running" || room.status === "over") return;
  room.status = active(room, 0, now) && active(room, 1, now) ? "ready" : "waiting";
}

function getRoom(roomCode: string): Room {
  const now = Date.now();
  removeExpiredRooms(now);
  const room = rooms.get(roomCode);
  if (!room) throw new CyberDuelRoomError(404, "Room not found or expired.");
  refreshWaitingStatus(room, now);
  return room;
}

function getPlayerIndex(room: Room, token: string): 0 | 1 {
  const index = room.seats.findIndex((seat) => seat?.token === token);
  if (index !== 0 && index !== 1) {
    throw new CyberDuelRoomError(403, "This invite token is not valid for the room.");
  }
  const seat = room.seats[index];
  if (!seat) throw new CyberDuelRoomError(403, "This room seat is no longer active.");
  seat.lastSeenAt = Date.now();
  room.updatedAt = seat.lastSeenAt;
  return index;
}

function presence(room: Room, now = Date.now()): CyberDuelPlayerPresence[] {
  return ([0, 1] as const).map((playerIndex) => ({
    playerIndex,
    connected: active(room, playerIndex, now),
    ready: active(room, playerIndex, now),
  }));
}

function roomState(room: Room, after = 0): CyberDuelRoomState {
  const now = Date.now();
  refreshWaitingStatus(room, now);
  const oldestEventId = room.events[0]?.id ?? room.eventCursor + 1;
  const safeAfter = after < oldestEventId - 1 ? oldestEventId - 1 : after;
  return {
    roomCode: room.roomCode,
    status: room.status,
    players: presence(room, now),
    events: room.events.filter((event) => event.id > safeAfter),
    eventCursor: room.eventCursor,
    snapshot: room.snapshot,
    winnerIndex: room.winnerIndex,
  };
}

function session(room: Room, token: string, playerIndex: 0 | 1): CyberDuelRoomSession {
  return { ...roomState(room), token, playerIndex };
}

export function createCyberDuelRoom(): CyberDuelRoomSession {
  const now = Date.now();
  removeExpiredRooms(now);
  if (rooms.size >= MAX_ROOMS) throw new CyberDuelRoomError(503, "Room capacity is temporarily full.");

  const firstCode = randomInt(1000, 10_000);
  let roomCode = "";
  for (let offset = 0; offset < 9000; offset += 1) {
    const candidate = `CYBER-${String(1000 + ((firstCode - 1000 + offset) % 9000))}`;
    if (!rooms.has(candidate)) {
      roomCode = candidate;
      break;
    }
  }
  if (!roomCode) throw new CyberDuelRoomError(503, "Could not reserve a room code. Please try again.");

  const token = randomBytes(32).toString("base64url");
  const room: Room = {
    roomCode,
    createdAt: now,
    updatedAt: now,
    status: "waiting",
    seats: [{ token, lastSeenAt: now }, null],
    events: [],
    eventCursor: 0,
    snapshot: null,
    winnerIndex: null,
  };
  rooms.set(roomCode, room);
  return session(room, token, 0);
}

export function joinCyberDuelRoom(roomCode: string, token?: string): CyberDuelRoomSession {
  const room = getRoom(roomCode);
  const now = Date.now();
  if (token) {
    const existingIndex = room.seats.findIndex((seat) => seat?.token === token);
    if (existingIndex === 0 || existingIndex === 1) {
      const seat = room.seats[existingIndex];
      if (!seat) throw new CyberDuelRoomError(403, "This room seat is no longer active.");
      seat.lastSeenAt = now;
      room.updatedAt = now;
      refreshWaitingStatus(room, now);
      return session(room, token, existingIndex);
    }
    throw new CyberDuelRoomError(403, "This room session has expired. Open the invite again to join.");
  }

  if (room.status === "running" || room.status === "over") {
    throw new CyberDuelRoomError(409, "This match has already started.");
  }
  const secondSeat = room.seats[1];
  if (secondSeat && now - secondSeat.lastSeenAt <= PRESENCE_TIMEOUT_MS) {
    throw new CyberDuelRoomError(409, "This room already has two players.");
  }

  const guestToken = randomBytes(32).toString("base64url");
  room.seats[1] = { token: guestToken, lastSeenAt: now };
  room.updatedAt = now;
  refreshWaitingStatus(room, now);
  return session(room, guestToken, 1);
}

export function pollCyberDuelRoom(roomCode: string, token: string, after: number): CyberDuelRoomState {
  const room = getRoom(roomCode);
  getPlayerIndex(room, token);
  return roomState(room, after);
}

export function startCyberDuelRoom(roomCode: string, token: string): CyberDuelRoomState {
  const room = getRoom(roomCode);
  const playerIndex = getPlayerIndex(room, token);
  if (playerIndex !== 0) throw new CyberDuelRoomError(403, "Only the room host can start the match.");
  refreshWaitingStatus(room);
  if ((room.status !== "ready" && room.status !== "over") || !active(room, 1)) {
    throw new CyberDuelRoomError(409, "Wait for your friend to join before starting.");
  }
  room.status = "running";
  room.events = [];
  room.eventCursor = 0;
  room.snapshot = null;
  room.winnerIndex = null;
  room.updatedAt = Date.now();
  return roomState(room);
}

export function sendCyberDuelInput(roomCode: string, token: string, action: CyberDuelAction): {
  accepted: true;
  eventCursor: number;
} {
  const room = getRoom(roomCode);
  const playerIndex = getPlayerIndex(room, token);
  if (playerIndex !== 1) throw new CyberDuelRoomError(403, "Only Player 2 sends remote controls.");
  if (room.status !== "running") throw new CyberDuelRoomError(403, "The match is not active.");

  room.eventCursor += 1;
  room.events.push({ id: room.eventCursor, playerIndex, action });
  if (room.events.length > MAX_ROOM_EVENTS) room.events.splice(0, room.events.length - MAX_ROOM_EVENTS);
  room.updatedAt = Date.now();
  return { accepted: true, eventCursor: room.eventCursor };
}

export function publishCyberDuelSnapshot(
  roomCode: string,
  token: string,
  snapshot: Record<string, unknown>,
): { accepted: true; eventCursor: number } {
  const room = getRoom(roomCode);
  const playerIndex = getPlayerIndex(room, token);
  if (playerIndex !== 0) throw new CyberDuelRoomError(403, "Only the room host publishes match state.");
  if (room.status !== "running" && room.status !== "over") {
    throw new CyberDuelRoomError(403, "The match is not active.");
  }
  const serialized = JSON.stringify(snapshot);
  if (serialized.length > MAX_SNAPSHOT_BYTES) {
    throw new CyberDuelRoomError(413, "Match update is too large.");
  }
  room.snapshot = snapshot;
  const winnerIndex = snapshot["winnerIndex"];
  if (snapshot["matchOver"] === true) {
    room.status = "over";
    room.winnerIndex = winnerIndex === 0 || winnerIndex === 1 ? winnerIndex : null;
  }
  room.updatedAt = Date.now();
  return { accepted: true, eventCursor: room.eventCursor };
}

export function leaveCyberDuelRoom(roomCode: string, token: string): { ok: true } {
  const room = getRoom(roomCode);
  const playerIndex = getPlayerIndex(room, token);
  if (playerIndex === 0) {
    rooms.delete(roomCode);
    return { ok: true };
  }
  room.seats[1] = null;
  if (room.status === "ready") room.status = "waiting";
  room.updatedAt = Date.now();
  return { ok: true };
}
