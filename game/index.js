const express=require("express")
const app = express()

const path=require("path")
const  http=require("http")
const { Server } = require("socket.io")

const server=http.createServer(app)

const io=new Server(server)

//this will allow us use HTML in our server
app.use(express.static(path.resolve("")))


let arr = []
let playingArray =[]

//passing the user's name to backend of our game server
io.on("connection", (socket) => {
    //This is used to get the value passed as name
    socket.on("find",(e)=>{

        //if value in name is not empty do this block
        if(e.name != null){
            //send the value to array[] but only if the array[]
            //contains 2 players
            arr.push(e.name)

            if(arr.length>=2){
                //Fist lets declear both players in a varable
                let p1obj={
                    p1name:arr[0],
                    p1value:"X",
                    p1move: ""
                }

                let p2obj={
                    p2name:arr[1],
                    p2value:"O",
                    p2move: ""
                }

                let obj={
                    p1:p1obj,
                    p2:p2obj,
                    sum:1
                }

                //now lets send both player_1 and player_2 varables stored 
                //In as object varable to playingArray[]
                playingArray.push(obj)

                //Then we remove the two players from the array[]
                //starting from index 0, deleting two elements
                arr.splice(0,2)

                //Now passing all players to socket to front-end
                io.emit("find", {allPlayers:playingArray})
            }
        }
    })

    //Getting the button clicked by the players
    socket.on("playing",(e)=>{
        //if the player is X
        if(e.value=="X"){
            let objToChange = playingArray.find(obj=>obj.p1.p1name===e.name)
            //assigning player id to move
            objToChange.p1.p1move=e.id
            objToChange.sum++
        }else if(e.value=="O"){
            let objToChange = playingArray.find(obj=>obj.p2.p2name===e.name)
            //assigning player id to move
            objToChange.p2.p2move=e.id
            objToChange.sum++
        }

        io.emit("playing", {allPlayers:playingArray})

    })

    //if the game is over, delete the array for the two players
    //using the filter function
    socket.on("gameOver",(e)=>{
        playingArray=playingArray.filter(obj=>obj.p1.p1name!==e.name)
        console.log(playingArray)
    })
})


app.get("/",(req,res)=>{
    return res.sendFile("index.html")
})

//Listen to server 
server.listen(3000,()=>{
    console.log("Port connected to game server 3000")
})

 