const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users=[];

//add code to check if username is valid
const isValid = (username) => { 
  const usernameOfUse=users.filter((user) => user.username===username);
  return usernameOfUse.length>0;
}

//add code to check if credentials match or not
const authenticatedUser = (username,password) => { 
  const credentialOfUser=users.filter((user) => user.username===username && user.password===password);
  return credentialOfUser.length>0;
}

//user must be registered to login
regd_users.post("/login", (req,res) => {
  console.log("login: ", req.body);
  const uname=req.body.username;
  const pword=req.body.password;
  if (!uname||!pword) {return res.status(404).json({message: "Error logging in!"});}
  if (authenticatedUser(uname,pword)) {
    let accessToken=jwt.sign({data: pword},'access',{expiresIn: 60*60});
    req.session.authorization={accessToken,uname}
    return res.status(200).send("User successfully logged in!");
  } 
  return res.status(208).json({message: "Invalid Login. Check username and password!"});
});    

//add a book review
regd_users.put("/auth/review/:isbn", (req, res)=> {
  const isbn=req.params.isbn;
  const review=req.body.review;
  const uname=req.session.authorization.username;
  console.log("add review: ",req.params,req.body,req.session);
  if (books[isbn]) {
    let book=books[isbn];
    book.reviews[uname]=review;
    return res.status(200).send("Review successfully posted!");
  }
  return res.status(404).json({message: `ISBN ${isbn} not found!`});
});

//delete a book review
regd_users.delete("/auth/review/:isbn", (req,res) => {
  const isbn=req.params.isbn;
  const uname=req.session.authorization.username;
  if (books[isbn]) {
    let book = books[isbn];
    delete book.reviews[uname];
    return res.status(200).send("Review successfully deleted!");
  }
  return res.status(404).json({message: `ISBN ${isbn} not found!`});
});

module.exports.authenticated=regd_users;
module.exports.isValid=isValid;
module.exports.users=users;