import { IncomingMessage, ServerResponse, createServer } from "http";
import * as fs from "fs";

function handleRequest(request: IncomingMessage, response: ServerResponse) {
    const { url, method } = request;

    switch (url) {
        case "/": {
            const fileContent = fs.readFileSync("./index.html");
            response.setHeader("content-type", "text/html");
            response.write(fileContent);
            return response.end();
        }

        case "/users": {
            const fileContent = fs.readFileSync("./users.html");
            response.setHeader("content-type", "text/html");
            response.write(fileContent);
            return response.end();
        }

        case "/create-user": {
            if (method !== "POST") return;
            const chunks = [];
            request.on("data", (chunk) => chunks.push(chunk));
            request.on("end", function () {
                const content = Buffer.concat(chunks).toString();
                console.log("formContent", content);
                response.statusCode = 302;
                response.setHeader("location", "/");
                response.end();
            });
        }

        case "/not-found": {
            response.statusCode = 404;
            response.write("Not Found (404)");
            return response.end();
        }

        default: {
            response.statusCode = 302;
            response.setHeader("location", "/not-found");
            return response.end();
        }
    }
}

const server = createServer(handleRequest);
const port = 3000;

server.listen(port, () => console.log(`Server is running on port ${port}`));
