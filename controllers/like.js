import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(401).json("Token is not valid!");
    const q = `SELECT userId FROM likes WHERE postId=?`;
    db.query(q, [req.query.postId], (err, data) => {
      if (err) return res.status(401).json(err);
      return res.status(200).json(data.map(r=>r.userId));
    });
  });
};

export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(401).json("Token is not valid!");
    const q = `INSERT INTO likes (userId,postId) VALUES (?)`;
    const values = [userInfo.id, req.body.postId]
    db.query(q, [values], (err, data) => {
      if (err) return res.status(401).json(err);
      return res.status(200).json("Post has been liked.");
    });
  });
};

export const deleteLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(401).json("Token is not valid!");
    const q = `DELETE FROM likes WHERE postId=? AND userId=?`;
    db.query(q, [req.query.postId,userInfo.id], (err, data) => {
      if (err) return res.status(401).json(err);
      return res.status(200).json("Post has been unliked.");
    });
  });
};
