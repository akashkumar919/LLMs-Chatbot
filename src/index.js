import express from "express";
import cors from "cors";
import genAIRouter from '../router/genAIRouter.js';

const app = express();
app.use(express.json());
// If URL encoded data aa raha ho:
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// PUBLIC API (No authentication required)
app.use(
  cors({
    origin: "*",     // 💥 Allow all domains
    methods: "GET,POST,PUT,DELETE",
  })
);





app.use('/api',genAIRouter)





app.listen(3000,()=>{
    console.log("server is listening at port 3000");
})