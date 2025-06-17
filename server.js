const http = require("http");
const fs = require("fs");


const server = http.createServer((req, res)=>{
    let text = "404";
    if (req.url === "/"){
        text = "Main page";
        res.end(text)
    }else if(req.url === "/login"){
        fs.readFile("login.html", (err, data)=>{
            res.end(data);
        });
    }else if(req.url === "/reg"){
        text = "Register page";
        res.end(text)
    }else if(req.url === "/handlerLogin"){
        console.log(req);
        let chunks = [];
        req.on('data', chunk => {chunks.push(chunk)});
        req.on("end", ()=>{
            console.log((chunks.concat(chunks).toString()));
        })
        res.end("Форма получена на сервере");
    }else {
        res.end(text);
    }

});

server.listen(3000, ()=>console.log("Сервер запущен http://localhost:3000 или http://127.0.0.1:3000"));