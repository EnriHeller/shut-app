//START Utility functions
const getHtml = (template)=> template.join("\n")
const renderMeMessage = (message) =>{
    const html = getHtml([
     '<div class ="app-chat__messages-me">',
            ' <p class="app-chat__messages-me-box--name">Yo</p>',
            `<p class="app-chat__messages-me-box--text">${message}</p>`,
        '</div>'
    ])

    return html

}

const renderUserMessage = (message, username)=>{
    const html = getHtml([
        '<div class ="app-chat__messages-user">',
               ' <p class="app-chat__messages-me-box--name">El otro</p>',
               `<p class="app-chat__messages-me-box--text">${message}</p>`,
           '</div>'
       ])
   
       return html
}
//END Utility functions

const socket = io(); // Connecting to Backend socket server
let user;

//DOM Elements

const chatBox = document.getElementById("chat-box")
const messagesBox = document.getElementById("messages-box")

//Toast
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  


//Authentication
Swal.fire({
    title: "Identify yourself",
    input: "text",
    text: "Enter your username to log in to the chat",
    inputValidator: (value)=>{
        if(!value){
            return "You must type a username to continue"
        }
    },
    allowOutsideClick:false,
    allowEscapeKey: false,
    padding: "16px"

}).then((result)=>{
    user = result.value
    socket.emit("login", user);
})

// Socket Logic

// Socket Emitters

chatBox?.addEventListener("keyup", (event)=>{
    if(event.key ==="Enter"){
        if(chatBox.value.trim().length){
            socket.emit("message", {user: user, message: chatBox.value});
            chatBox.value = "";
        }
    }
})

//Socket Listeners

socket.on("message-logs", (data)=>{
    const html = getHtml(data.map(item=>{
        if(item.user === user){
            return renderMeMessage(item.message)
        }else{
            return renderUserMessage(item.message, item.user)
        }
    }))

    messagesBox.innerHTML = html

})

socket.on("new-user", (user)=>{
    Toast.fire({
        icon: 'info',
        title: `${user} is online`
      })
})

socket.on("welcome", (user)=>{
    Toast.fire({
        icon: 'success',
        title: `Welcome ${user}`
      })
})