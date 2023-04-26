import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(401).json("Token is not valid!");
    const q = `SELECT followerUserId FROM relationships WHERE followedUserId=?`;
    db.query(q, [req.query.followedUserId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data.map((r) => r.followerUserId));
    });
  });
};
export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(401).json("Token is not valid!");
    const q = `INSERT INTO relationships (followerUserId,followedUserId) VALUES (?)`;
    const values = [userInfo.id, req.body.userId];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been followed.");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(401).json("Token is not valid!");
    const q = `DELETE FROM relationships WHERE followerUserId=? AND followedUserId=?`;

    db.query(q, [userInfo.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("User has been unfollowed!");
    });
  });
};
