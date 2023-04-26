import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(401).json("Token is not valid!");
    const userId = req.query.userId;
    const q =
      userId !== "undefined"
        ? `SELECT p.*, u.id AS userId, name, profilePicture 
        FROM posts AS p JOIN users AS u ON (u.id = p.userId) 
        WHERE p.userId = ? ORDER BY p.createdAt DESC`
        : `SELECT p.*, u.id as userId, name, profilePicture FROM posts as p INNER JOIN users as u ON(p.userId = u.id) INNER JOIN relationships as r ON (p.userId = r.followedUserId AND r.followerUserId = ?) UNION ALL SELECT p.*, u.id as userId, name, profilePicture FROM posts as p INNER JOIN users as u ON(p.userId = u.id) WHERE userId = ? ORDER BY createdAt DESC`;

    const values =
      userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(401).json("Token is not valid!");
    const q = `INSERT INTO posts (description,img,userId,createdAt) VALUES (?)`;
    const values = [
      req.body.desc,
      req.body.img,
      userInfo.id,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(401).json("Token is not valid!");
    const q = `DELETE FROM posts WHERE posts.id = ? AND posts.userId = ?`;
    db.query(q, [req.params.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.affectedRows > 0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post!");
    });
  });
};
