import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getStories = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(401).json("Token is not valid!");
    const q = `SELECT * FROM stories WHERE userId=?`;
    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(401).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addStory = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(401).json("Token is not valid!");
    const q = "INSERT INTO stories (img,userId) VALUES (?)";
    const values = [req.body.img, userInfo.id];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Created.");
    });
  });
};
