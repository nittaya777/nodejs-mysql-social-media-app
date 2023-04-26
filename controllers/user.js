import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(401).json("Token is not valid!");
    const q = `SELECT username,email,name,coverPicture,profilePicture,city,website FROM users WHERE id = ?`;
    db.query(q, [req.params.userId], (err, data) => {
      if (err) return res.status(401).json(err);
      return res.status(200).json(data[0]);
    });
  });
};

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", (error, userInfo) => {
    if (error) return res.status(401).json("Token is not valid!");
    const q = "UPDATE users SET `name`=?,`city`=?,`website`=?,`coverPicture`=?,`profilePicture`=? WHERE id=?";

    db.query(q, [req.body.name,
      req.body.city,
      req.body.website,
      req.body.coverPicture,
      req.body.profilePicture,
      userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Updated.");
      return res.status(403).json('You can update only your profile!')
    });
  });
};
