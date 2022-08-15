const express = require('express');
const router = express.Router();
const path = require('path');
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
app.use(express.static(path.join(__dirname+"/public")));
var config = require("./database/dbConfig");
const sql = require("mssql/msnodesqlv8");
var ress;
function getMessages(){
    sql.connect(config,function(err){
        if(err){
            console.log(err);
        }
        var req = new sql.Request();
        req.query('select * from Messages',function(err,recordSet){
            if(err){
                console.log(err)
            }else{
            ress = recordSet
                
                
            }
        })
    })
    return ress
}

router.get("/get",function(req,res,next){
        res.json(getMessages())
        console.log(getMessages())
        
}) 
app.use("/api",router)

function setMessages(username,message){
    sql.connect(config,function(err){
        if(err){
            console.log(err);
        }
        var req = new sql.Request();
        req.query`INSERT dbo.Messages (username,message)  VALUES (${username},${message})`,function(err,recordSet){
            if(err){
                console.log(err)
            }else{
                console.log(recordSet)
            }
        }
    })
}
io.on("connection",function(socket){
    
    socket.on ("newuser",function(username){
        socket.broadcast.emit("update",username + " joined the conversation");
    });
    socket.on ("exituser",function(username){
        socket.broadcast.emit("update",username + " left the conversation");
    });
    socket.on ("chat",function(message){
        socket.broadcast.emit("chat",message);
        setMessages(message.username,message.text);
        
    });
});

server.listen(5000);