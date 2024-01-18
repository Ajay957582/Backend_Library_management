import express from "express";
import cors from "cors";
import { User } from "./user.model.js";
import { Admin } from "./adminList.model.js";
import jwt, { decode } from "jsonwebtoken";
import { Book } from "./book.model.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "hello" });
});

app.post("/register", async (req, res) => {
  // console.log(req.body);
  // res.status(200).json(req.body);

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    res.json({ message: "user already exists" });
  } else {
    const enrollmentCheck = await User.findOne({
      enrollment_number: req.body.enrollmentNumber,
    });
    if (enrollmentCheck) {
      res.json({ message: "Enrollment Number already exists" });
    } else {
      try {
        const newUser = await User.create({
          name: req.body.userName,
          email: req.body.email,
          password: req.body.password,
          profile_pic: req.body.profile_pic,
          enrollment_number: req.body.enrollmentNumber,
        });
        if (newUser) {
          res.json({ message: "user is registered successfully" });
        }
      } catch (error) {
        console.log(error, "error from register post endpoint ");
      }
    }
  }
});

app.post("/login", async (req, res) => {
  try {
    const luser = await User.findOne({ email: req.body.lemail });
    if (!luser) {
      res.json({ message: "user not exists" });
    } else {
      if (req.body.lpassword === luser.password) {
        // if (req.body.checkBox) {
        //   const token = jwt.sign({ email: luser.email }, "shhhhh");
        //   res.json({ token });
        // }
        const token = jwt.sign({ email: luser.email }, "shhhhh");
        res.json({ token });
      } else {
        res.json({ message: "wrong password" });
      }
    }
  } catch (error) {
    console.log(error, "from login post endpoint");
  }
});

app.post("/isadmin", (req, res) => {
  // console.log(req.body);
  // res.json({ message: "recived token" });
  jwt.verify(req.body.tokenFromLocal, "shhhhh", async (err, decoded) => {
    // console.log(decoded.email);
    const admin = await Admin.findOne({ email: decoded.email });
    // console.log(admin);
    if (admin) {
      res.json({ message: "is admin" });
    } else {
      res.json({ message: "not admin" });
    }
    if (err) {
      console.log(err, "this is err from isadmin endpoint");
    }
  });
});

app.post("/addbook", async (req, res) => {
  const bookImage = req.body.coverImage;
  const bookId = req.body.bookId;
  const bookName = req.body.bookName;
  const bookPDF = req.body.bookPdf;
  const bookAuthor = req.body.author;
  // console.log(req.body);
  // console.log(req.body.coverImage);
  // res.json({ message: "book details recived" });
  if (bookImage === "") {
    res.json({ message: "Network Issues !! please try again" });
  }

  const book = await Book.findOne({ bookId });
  if (book) {
    res.json({ message: "Book already exists !! Add another Book" });
  } else {
    const newBook = await Book.create({
      bookId,
      bookName,
      bookAuthor,
      bookImage,
      bookPDF,
    });
    if (!newBook) {
      console.log("Bhai nayi book database mei bani hi nahiii");
      res.json({ message: "Something Went wrong !! please try again" });
    } else {
      console.log("New book added to database successfully");
      res.json({ message: "Book Added successfully" });
    }
  }
});

app.post("/irbook", async (req, res) => {
  const user = await User.findOne({ enrollment_number: req.body.enrollment });
  if (user) {
    res.json(user.books);
  } else {
    res.json({ message: "Didnt found any user of this enrollment ID!!" });
  }
});

app.post("/issuebook", async (req, res) => {
  if (req.body.searchedEnrollment === "") {
    res.json({
      message: "To add a new book you need to , search a user first !!",
    });
  }
  // console.log(req.body);
  const book = await Book.findOne({ bookId: req.body.bookId });
  const user = await User.findOne({
    enrollment_number: req.body.searchedEnrollment,
  });

  if (!user.books.some((elem) => elem.bookId === req.body.bookId)) {
    if (!book) {
      res.json({ message: "Can't find any book by this book Id" });
    } else {
      // console.log(book);
      // console.log(user);
      const date = new Date();
      const updatedUser = await User.findOneAndUpdate(
        {
          enrollment_number: req.body.searchedEnrollment,
        },
        { $addToSet: { books: { bookId: book.bookId, issueDate: date } } },
        { new: true }
      );
      // console.log(updatedUser);
      res.json({
        message: "book Updates Successfully!!",
        booksList: updatedUser.books,
      });
    }
  } else {
    res.json({ message: "book already exists" });
  }
});

app.post("/profilepic", (req, res) => {
  // console.log(req.body);
  // res.json({ message: "recived " });
  jwt.verify(req.body.x, "shhhhh", async function (err, decoded) {
    if (err) {
      console.log(
        err,
        "error from profile pic endpoint ,may be token is not decoded properly"
      );
    }
    // console.log(decoded.email);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      console.log(
        "user not found !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
      );
    }
    res.json({
      message: "success",
      profile_pic: user.profile_pic,
    });
  });
});

app.post("/book", async (req, res) => {
  // console.log(req.body);
  // res.json({ message: "success" });
  const book = await Book.findOne({ bookId: req.body.bookId });
  if (!book) {
    console.log("book didnt exists ");
  } else {
    res.json({ message: "success", book });
  }
});

app.post("/deletebook", async (req, res) => {
  // console.log(req.body.index/enrollment);
  // res.json({ message: "success" });

  const user = await User.findOne({ enrollment_number: req.body.enrollment });
  if (!user) {
    console.log("not getting user by this enrollment");
  } else {
    const updatedUser = await User.findOneAndUpdate(
      { enrollment_number: req.body.enrollment },
      { $pull: { books: { bookId: req.body.bookId } } },
      { new: true }
    );
    // console.log(updatedUser);
    res.json({ message: "success", updatedUser: updatedUser.books });
  }
});

app.post("/profile", (req, res) => {
  // console.log(req.body.token);
  // res.json({ message: "success" });
  jwt.verify(req.body.token, "shhhhh", async (err, decoded) => {
    if (err) {
      console.log(err, "may be failed to vrify token on profile endpoint");
    } else {
      const user = await User.findOne({ email: decoded.email });
      res.json(user);
    }
  });
});

app.post("/mybooks", (req, res) => {
  // console.log(req.body.email);
  // res.json({ message: "success" });

  jwt.verify(req.body.token, "shhhhh", async (err, decoded) => {
    if (err) {
      console.log(err, "failed to verify , from my books");
    } else {
      const user = await User.findOne({ email: decoded.email });
      res.json({ arr: user.books, name: user.name });
    }
  });
});

app.post("/bookname", async (req, res) => {
  const book = await Book.findOne({ bookId: req.body.bookId });
  res.json({ bookName: book.bookName });
});

app.get("/title", async (req, res) => {
  const response = await Book.aggregate([
    {
      $project: { bookName: 1, _id: 0 },
    },
    {
      $group: {
        _id: null,
        bookNames: {
          $push: "$bookName",
        },
      },
    },
  ]);
  res.json(response[0].bookNames);
});

app.get("/id", async (req, res) => {
  const response = await Book.aggregate([
    {
      $project: { bookId: 1, _id: 0 },
    },
    {
      $group: {
        _id: null,
        bookId: {
          $push: "$bookId",
        },
      },
    },
  ]);

  res.json(response[0].bookId);
});

app.post("/searchbytitle", async (req, res) => {
  // console.log(req.body);
  const book = await Book.findOne({ bookName: req.body.searchBy });
  res.json(book);
});

app.post("/searchbyid", async (req, res) => {
  const book = await Book.findOne({ bookId: req.body.searchBy });
  res.json(book);
});

app.get("/adminlist", async (req, res) => {
  const adminList = await Admin.aggregate([
    {
      $group: {
        _id: null,
        adminList: {
          $push: "$email",
        },
      },
    },
  ]);
  res.json(adminList[0].adminList);
});

app.post("/deleteadmin", async (req, res) => {
  await Admin.findOneAndDelete({ email: req.body.email });
  const adminList = await Admin.aggregate([
    {
      $group: {
        _id: null,
        adminList: {
          $push: "$email",
        },
      },
    },
  ]);
  res.json(adminList[0].adminList);
});

app.post("/addadmin", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.json({ message: "This Email is not a user" });
  } else {
    const admin = await Admin.findOne({ email: req.body.email });
    if (admin) {
      res.json({ message: "Admin Already Exists" });
    } else {
      await Admin.create({ email: req.body.email });

      const adminList = await Admin.aggregate([
        {
          $group: {
            _id: null,
            adminList: {
              $push: "$email",
            },
          },
        },
      ]);
      res.json(adminList[0].adminList);
    }
  }
});

export default app;
