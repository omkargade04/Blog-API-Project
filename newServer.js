import express from "express"
import axios from "axios"
import bodyParser from "body-parser"

const app = express();
const port = 3000;
const API_URL = "http://localhost:4000";

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Route to render the main page
app.get("/", async (req, res) => {
    try{
        const result = await axios.get(`${API_URL}/posts`);
        console.log(result);
        res.render("index.ejs", {posts: result.data});
    }
    catch(error)
    {
        res.status(500).json({ message: "Error fetching posts" });
    }   
});

// Route to render the edit page
app.get("/new", async(req, res) => {
    res.render("modify.ejs", {heading: "New Post", submit: "Create Post"});
});

app.get("/edit/:id", async(req, res) => {
    try{
        const ID = req.params.id;
        const result = await axios.get(`${API_URL}/posts/${ID}`);
        res.render("modify.ejs", {
            heading: "Edit Post",
            submit: "Update Post",
            post: result.data,
        });
    }
    catch(error)
    {
        res.status(500).json({message: "Error creating post"})
    }
    
});

// Create a new post
app.post("/api/posts", async(req, res) => {
    try{
        const ID = req.params.id;
        const result = await axios.post(`${API_URL}/posts`, req.body);
        console.log(result.data);
        res.redirect("/");
    }
    catch(error)
    {
        res.status(500).json({message: "Error creating Post"});
    }
});

// Partially update a post
app.post("/api/posts/:id", async(req, res) => {
    console.log("called");
    try{
        const ID = req.params.id;
        const result = await axios.patch(`${API_URL}/posts/${ID}`,req.body);
        console.log(result.data);
        res.redirect("/");
    }
    catch(error)
    {
        res.status(500).json({message: "Error Creating Posts"});
    }
});

// Delete a post
app.get("/api/posts/delete/:id", async(req, res) => {
    try{
        const ID = req.params.id;
        await axios.delete(`${API_URL}/posts/${ID}`);
        res.redirect("/");
    }
    catch(error)
    {
        res.status(500).json({message: "Error Creating Posts"});
    }
});

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
  });

