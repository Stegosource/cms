const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const config = require("./config");

const app = express();

// Takes the raw requests and turns them into usable properties on req.body
app.use(cors());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Models
const { sequelize } = require("./models");

// Middlewares
const uploadsMiddleware = require("./middleware/uploads");

// Controllers
const UsersController = require("./controllers/UsersController");
const MediaController = require("./controllers/MediaController");

// Routes
const userRoutes = require("./routes/users");
const contentRoutes = require("./routes/contents");

// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").load();
// }

// Serving files from the upload folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const CLIENT_PATH = path.join(__dirname + "/client");

app.get("/", (req, res) => {
  res.sendFile(path.join(CLIENT_PATH + "/index.html"));
});

// Users
app.use("/api/v1/users", userRoutes);
app.post("/api/v1/users/login", UsersController.login);

// Contents
app.use("/api/v1/contents", contentRoutes);

// Media
app.get("/api/v1/media", MediaController.getMedia);
app.post(
  "/api/v1/media",
  uploadsMiddleware.upload,
  // uploadsMiddleware.resize,
  MediaController.addMedia
);
app.delete("/api/v1/media", MediaController.deleteMedia);

/** Beginning GraphQL stuff *
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");

const users = [
  // Dummy data
  {
    id: 1,
    name: "Brian",
    age: "21",
    gender: "M"
  },
  {
    id: 2,
    name: "Kim",
    age: "22",
    gender: "M"
  }
  // ...
];

// Initialize a GraphQL schema
const schema = buildSchema(`
	type Query {
		user(id: Int!): Person
		users(gender: String): [Person]
	},
	type Person {
		id: Int
		name: String
		age: Int
		gender: String
	},
	type Mutation {
		updateUser(id: Int!, name: String!, age: String): Person
	}
`);

const getUser = args => {
  // return a single user based on id
  const userID = args.id;
  return users.filter(user => {
    return user.id == userID;
  })[0];
};

const retrieveUsers = args => {
  // Return a list of users. Takes an optional gender parameter
  if (args.gender) {
    const gender = args.gender;
    return users.filter(user => user.gender === gender);
  } else {
    return users;
  }
};

const updateUser = ({ id, name, age }) => {
  users.map(user => {
    if (user.id === id) {
      user.name = name;
      user.age = age;
      return user;
    }
  });

  return users.filter(user => user.id === id)[0];
};

// Root resolver
const root = {
  user: getUser,
  users: retrieveUsers,
  updateUser: updateUser
};

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema, // Must be provided
    rootValue: root,
    graphiql: true // Enable GraphiQL when server endpoint is accessed in browser
  })
);
/** End GraphQL stuff */

const port = process.env.PORT || 8000;

sequelize.sync({ force: false }).then(() => {
  app.listen(port);
  console.log(`Server started on port ${port}`);
});
