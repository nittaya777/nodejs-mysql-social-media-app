import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const addComments = (req,res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(401).json("Token is not valid!");
    const q = `INSERT INTO comments (description,createdAt,userId,postId) VALUES (?)`;
    const values = [
        req.body.desc,
        moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        userInfo.id,
        req.body.postId
    ]
    db.query(q, [values], (err, data) => {
      if (err) return res.status(401).json(err);
      return res.status(200).json('Comment has been created.');
    });
  });
};

export const getComments = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(401).json("Token is not valid!");
    const q = `SELECT c.*,u.name,u.profilePicture FROM comments as c JOIN users as u ON(c.userId = u.id) WHERE postId=? `;
    db.query(q, [req.query.postId], (err, data) => {
      if (err) return res.status(401).json(err);
      return res.status(200).json(data);
    });
  });
};
