//node js proxy
const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
const axios = require('axios');

const PORT = process.env.PORT || 8000;
const BACKEND_HOST = process.env.PORT || 'http://localhost:8080';


axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
  .then(response => {
    console.log(response.data.url);
    console.log(response.data.explanation);
  })
  .catch(error => {
    console.log(error);
  });


app.use(cors());


app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res)=>{
    res.send('server is running');
})

app.post("/images", async(req, res) => {
    const result = await axios.post(BACKEND_HOST + '/images', req.body);
    res.send(result);
})

app.post("/validate", async(req, res) => {
    const result = await axios.post(BACKEND_HOST + '/validate', req.body);
    res.send(result);
})

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });


server.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`)
})