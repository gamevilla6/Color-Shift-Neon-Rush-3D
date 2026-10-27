import { Router, type IRouter, type Response } from "express";
import {
  CreateCyberDuelRoomResponse,
  JoinCyberDuelRoomBody,
  JoinCyberDuelRoomResponse,
  LeaveCyberDuelRoomBody,
  LeaveCyberDuelRoomResponse,
  PollCyberDuelRoomBody,
  PollCyberDuelRoomResponse,
  PublishCyberDuelSnapshotBody,
  PublishCyberDuelSnapshotResponse,
  SendCyberDuelInputBody,
  SendCyberDuelInputResponse,
  StartCyberDuelRoomBody,
  StartCyberDuelRoomResponse,
} from "@workspace/api-zod";
import {
  CyberDuelRoomError,
  createCyberDuelRoom,
  joinCyberDuelRoom,
  leaveCyberDuelRoom,
  pollCyberDuelRoom,
  publishCyberDuelSnapshot,
  sendCyberDuelInput,
  startCyberDuelRoom,
} from "../lib/cyber-duel-rooms";

const router: IRouter = Router();

function sendFailure(res: Response, error: unknown): void {
  if (error instanceof CyberDuelRoomError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }
  res.status(500).json({ error: "The room service encountered an error." });
}

router.post("/cyber-duel/rooms", (_req, res) => {
  try {
    res.status(201).json(CreateCyberDuelRoomResponse.parse(createCyberDuelRoom()));
  } catch (error) {
    sendFailure(res, error);
  }
});

router.post("/cyber-duel/rooms/join", (req, res) => {
  const parsed = JoinCyberDuelRoomBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Room code or room token is invalid." });
    return;
  }
  try {
    res.json(JoinCyberDuelRoomResponse.parse(joinCyberDuelRoom(parsed.data.roomCode, parsed.data.token)));
  } catch (error) {
    sendFailure(res, error);
  }
});

router.post("/cyber-duel/rooms/poll", (req, res) => {
  const parsed = PollCyberDuelRoomBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Room poll request is invalid." });
    return;
  }
  try {
    res.json(PollCyberDuelRoomResponse.parse(
      pollCyberDuelRoom(parsed.data.roomCode, parsed.data.token, parsed.data.after),
    ));
  } catch (error) {
    sendFailure(res, error);
  }
});

router.post("/cyber-duel/rooms/start", (req, res) => {
  const parsed = StartCyberDuelRoomBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Room start request is invalid." });
    return;
  }
  try {
    res.json(StartCyberDuelRoomResponse.parse(
      startCyberDuelRoom(parsed.data.roomCode, parsed.data.token),
    ));
  } catch (error) {
    sendFailure(res, error);
  }
});

router.post("/cyber-duel/rooms/input", (req, res) => {
  const parsed = SendCyberDuelInputBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Player input is invalid." });
    return;
  }
  try {
    res.status(202).json(SendCyberDuelInputResponse.parse(
      sendCyberDuelInput(parsed.data.roomCode, parsed.data.token, parsed.data.action),
    ));
  } catch (error) {
    sendFailure(res, error);
  }
});

router.post("/cyber-duel/rooms/snapshot", (req, res) => {
  const parsed = PublishCyberDuelSnapshotBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Match state is invalid." });
    return;
  }
  try {
    res.status(202).json(PublishCyberDuelSnapshotResponse.parse(
      publishCyberDuelSnapshot(parsed.data.roomCode, parsed.data.token, parsed.data.snapshot),
    ));
  } catch (error) {
    sendFailure(res, error);
  }
});

router.post("/cyber-duel/rooms/leave", (req, res) => {
  const parsed = LeaveCyberDuelRoomBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Room leave request is invalid." });
    return;
  }
  try {
    res.json(LeaveCyberDuelRoomResponse.parse(
      leaveCyberDuelRoom(parsed.data.roomCode, parsed.data.token),
    ));
  } catch (error) {
    sendFailure(res, error);
  }
});

export default router;
