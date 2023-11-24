/*import http, { IncomingMessage, Server, ServerResponse } from "http"; /*
implement your server code here

const server: Server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "GET") {
      res.end(JSON.stringify({ name: "hello" }));
    }
  }
);

server.listen(3005);  */

import * as http from "http";
import getReq from "./methods/get-request";
import putReq from "./methods/put-request";
import postReq from "./methods/post-request";
import deleteReq from "./methods/delete-request";
import * as dotenv from "dotenv";
import * as path from "path";

import fs from "fs";

dotenv.config();

//const filePath = path.resolve(__dirname, "./data/database.json");

const filePath = path.join(__dirname, '../', "database.json");
const companies = JSON.parse(fs.readFileSync(filePath, "utf-8"));
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '[]'); // Initialize with an empty array
} else {
  
}


const PORT  = process.env.PORT || 5000;

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
    (req as any).companies = companies; // Changed "movies" to "companies"

    switch (req.method) {
        case "GET":
            getReq(req, res);
            break;
        case "POST":
            postReq(req, res);
            break;
        case "PUT":
            putReq(req, res);
            break;
        case "DELETE":
            deleteReq(req, res);
            break;
        default:
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.write(JSON.stringify({ title: "Not Found", message: "Hello Matthew, welcome to the node course" }));
            res.end();
    }
});

server.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
});
