const express = require("express");
const cors = require("cors");
require("./config/db.config");

const app = express();
const users = require("./routes/user.route");
const posts = require("./routes/post.route");
const comment = require("./routes/comment.route");
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(users);
app.use(posts);
app.use(comment);

// Node Server Start With PORT 3000
app.listen(port, () => {
   console.log("port is on...", port);
});
