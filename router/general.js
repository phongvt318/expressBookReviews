const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  let userofsamename=users.filter((user) => {
    return user.username===username
  });
  if (userofsamename.length>0) return true;
  return false;  
}

public_users.post("/register", function (req, res) {
  const uname=req.body.username;
  const pword=req.body.password;
  if (uname&&pword) {
    if (!doesExist(uname)) { 
      users.push({"username":uname,"password":pword});
      return res.status(200).json({message: "User successfully registred. Now you can login!"});
    } 
    return res.status(404).json({message: "User already exists!"});
  } 
  return res.status(404).json({message: "Unable to register user!"});
});

//add code to get all books
public_users.get('/', (req, res)=> {res.send(JSON.stringify(books,null,4));});

//add code to get book details on isbn
public_users.get("/isbn/:isbn", (req,res) => {const ISBN=req.params.isbn; res.send(books[ISBN])});
  
//add code to get book details on author
public_users.get('/author/:author', (req, res)=> {
  let ans=[]
  for (const [key,values] of Object.entries(books)) {
    const book=Object.entries(values);
    for (let i=0; i<book.length ; i++) {
      if  (book[i][0]=='author' && book[i][1]==req.params.author) {ans.push(books[key]);}
    }
  }
  if  (ans.length==0) {return res.status(300).json({message: "Not found!"});}
  res.send(ans);
});

//add code to get book details on title
public_users.get('/title/:title', (req,res) => {
  let ans=[]
  for(const [key,values] of Object.entries(books)) {
    const book=Object.entries(values);
    for (let i=0; i<book.length ; i++) {
      if (book[i][0]=='title' && book[i][1]==req.params.title) {ans.push(books[key]);}
    }
  }
  if (ans.length==0) {return res.status(300).json({message: "Not found!"});}
  res.send(ans);
});

//add code to get book reviews
public_users.get("/review/:isbn", (req,res) => {
  const ISBN=req.params.isbn; res.send(books[ISBN].reviews)
});

//--------- Task 10 ----------------------------------------------------------
//add code using promise callbacks
let getBookList = () => {
  return new Promise((resolve,reject) => {resolve(books);})
}
//to get all books in the shop
public_users.get("/", (req, res)=> {
  getBookList().then(
    (bk)=>res.send(JSON.stringify(bk, null, 4)),
    (error)=>res.send("Denied access!")
  );  
});

//--------- Task 11 ----------------------------------------------------------
//add code using promise callbacks
let getFromISBN = (isbn) => {
  let abook=books[isbn];  
  return new Promise((resolve,reject) => {
    if (abook) resolve(abook);
    reject("Not found!");
  })
}
//to get book details on isbn
public_users.get("/isbn/:isbn", (req,res) => {
  const isbn = req.params.isbn;
  getFromISBN(isbn).then(
    (bk)=>res.send(JSON.stringify(bk, null, 4)),
    (error)=>res.send(error)
  )
});

//--------- Task 12 ----------------------------------------------------------
//add code using promise callbacks
let getFromAuthor = (author) => {
  let result=[];
  return new Promise((resolve,reject) => {
    for (var isbn in books) {
      let abook=books[isbn];
      if (abook.author===author) {result.push(abook);}
    }
    resolve(result);  
  })
}
//to get book details on author
public_users.get("/author/:author", (req, res)=> {
  const anauthor = req.params.author;
  getFromAuthor(anauthor).then(
    output=>res.send(JSON.stringify(output, null, 4))
  );
});

//--------- Task 13 ----------------------------------------------------------
//add code using promise callbacks
let getFromTitle = (title) => {
  let result=[];
  return new Promise((resolve,reject) => {
    for (var isbn in books) {
      let abook=books[isbn];
      if (abook.title===title) {result.push(abook);}
    }
    resolve(result);  
  })
}
//to get book details on title
public_users.get("/title/:title", (req,res) => {
  const title = req.params.title;
  getFromTitle(title).then(
    output =>res.send(JSON.stringify(output, null, 4))
  );
});

module.exports.general=public_users;