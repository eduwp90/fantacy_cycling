'use strict';
import {
  getUserRoster,
  setNewUser,
  getUserDetails,
  fetchAllRiders,
  fetchAllUsers,
} from '../models/user.model.js';
import {
  addRiderToRoster,
  removeRiderFromRoster,
  changeUserTeam,
} from '../models/roster.model.js';
import { Request, Response } from 'express';
import { QueryResult } from 'pg';

interface User {
  id: number;
  email: string;
  nickname: string;
  score: number;
  money: number;
}

interface Rider {
  id: number;
  name: string;
  price: number;
  roster: number;
  added_at: Date;
  team: string;
  image: string;
  classic_pnts: number;
  gc_pnts: number;
  tt_pnts: number;
  sprint_pnts: number;
  climb_pnts: number;
  next_race: string;
}

const fetchRiders = async (req: Request, res: Response) => {
  try {
    const fullList: Rider[] = await fetchAllRiders();
    res.status(200);
    res.send(fullList);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const createNewTeam = async (req: Request, res: Response) => {
  try {
    const {
      username,
      team,
      password,
    }: { username: string; team: string; password: string } = req.body;
    const newUser: User = await setNewUser({
      username,
      team,
      password,
      score: 0,
    });
    res.status(201);
    res.send(newUser);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const fetchUserData = async (req: Request, res: Response) => {
  try {
    const nickname: string = req.body.nickname;
    const email: string = req.body.email;
    console.log('nickname in control', nickname);
    let userDetails: User | any = await getUserDetails(nickname, email);
    console.log(userDetails);
    if (!userDetails) {
      userDetails = await setNewUser(req.body);
    }
    if (!userDetails.rowCount) {
      res.status(201);
      res.send(userDetails);
    } else {
      console.log('problem getting user: doesnt exist');
      res.sendStatus(204);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const changeTeamName = async (req: Request, res: Response) => {
  try {
    const user: string = req.params.id;
    const { newName }: { newName: string } = req.body;
    const userDetails: QueryResult = await changeUserTeam(user, newName);
    res.status(201);
    res.send(userDetails);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const fetchTeam = async (req: Request, res: Response) => {
  try {
    const user: string = req.params.id;
    const rowOfRiders: Rider[] = await getUserRoster(user);
    res.status(201);
    res.send(rowOfRiders);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const fetchUsers = async (req: Request, res: Response) => {
  try {
    const users: User[] = await fetchAllUsers();
    res.status(201);
    res.send(users);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const addRider = async (
  req: Request<{ id: string; rider: string }>,
  res: Response
) => {
  try {
    const { id, rider } = req.params;
    const roster: QueryResult | false = await addRiderToRoster(id, rider);
    if (roster) {
      res.status(204);
      res.send(roster); // will automatically send status 200
    } else {
      res.sendStatus(405);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const removeRider = async (
  req: Request<{ id: string; rider: string }>,
  res: Response
) => {
  try {
    const { id, rider } = req.params;
    const team: QueryResult | string = await removeRiderFromRoster(id, rider);
    res.status(204);
    res.send(team); // will automatically send status 200
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export {
  fetchTeam,
  fetchUserData,
  createNewTeam,
  addRider,
  removeRider,
  fetchRiders,
  changeTeamName,
  fetchUsers,
};
