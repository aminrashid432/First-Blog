import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path"; //n ES Modules (using import syntax), the special variable __dirname doesn’t exist automatically like it 
                               // does in CommonJS (require) modules. To get the equivalent of __dirname, developers use this technique:
import path from "path";
import { fileURLToPath } from "url";


const __dirname = dirname(fileURLToPath(import.meta.url)); 
const app = express(); // app is an express object
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true })); // body-parser middleware

app.set('views', path.join(__dirname, 'views')); //tells Express where to find your view (template) files, such as your EJS files.
app.set('view engine', 'ejs'); // "view engine" is what allows us to use dynamic html like ejs. Thats why we set it.

// In-memory storage for posts (resets on server restart)
let posts = [];

app.get("/", (req, res) => {
    res.render("Home", { posts: posts });
});

app.get("/Post", (req , res) => {
    res.render("Post")
});

app.get('/Edit', (req, res) => { // you need a query like this for this edit endpoint to work. http://localhost:3000.     " /edit?index=0 " 
  const index = parseInt(req.query.index, 10); // The second argument, 10, tells parseInt to treat the string as a base-10 (decimal) number—this means normal numbers like we use every day (0–9 digits).
                                              // extracts and converts the post index from the URL query string.
  if (!isNaN(index) && index >= 0 && index < posts.length) { // ensures that the provided index is valid and safe to use before performing any operations (like reading, editing, or deleting a post).
// isNaN means not a number
    res.render('Edit', { post: posts[index], index: index }); // renders post with data (".ejs", "data")
  } else {
    res.redirect('/'); // if it isnt a number we get redirected back to the homepage
  }
});

app.post('/post', (req, res) => {
  const newPost = req.body.blog; // retrieves the submitted post content from an HTML form.
  if (newPost && newPost.trim() !== '') { // .trim() is a JavaScript string method that removes whitespace from both ends of a string:
    posts.unshift(newPost); // Add new post at the start (newest first)
  }
  res.redirect('/'); // Redirect back to home page
});

app.post('/delete', (req, res) => { // this endpoint is linked to the form wherever delete is called as an action
  const index = parseInt(req.body.index, 10); // This line gets the post number (called the "index") that was sent from your HTML form, and it turns it into a real number (instead of a text string).
                                             // The 10 just means, “treat this as a normal number” (base 10, like we use every day).
  if (!isNaN(index) && index >= 0 && index < posts.length) {
    posts.splice(index, 1); // Remove post at index 
                           // This line removes a post from the posts array. It starts at the given index and deletes one post from that position using the splice() method.
  }
  res.redirect('/');
});

app.post('/Edit', (req, res) => {
  const index = parseInt(req.body.index, 10); // retrieves and converts the post index from a submitted form into a number.
  const updatedPost = req.body.updatedPost; // retrieves the edited post content from the submitted form. This is located in edit.ejs

  if ( !isNaN(index) && index >= 0 && index < posts.length && updatedPost.trim() !== '') {
    posts[index] = updatedPost.trim(); // updates the post at a specific index in the posts array with the newly edited post content submitted by the user.
                                      // .trim() "   Hello World   ".trim();  converts to  --> "Hello World"
  }
  res.redirect('/');
});


app.listen(port, () => {
console.log(`You are now listening at ${port}...`)
});