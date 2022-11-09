let user;
let socket = io();

do {
    user = prompt("Enter your name.")
} while (!user)

// varriables
const commentInput = document.getElementById("commentInput");
const postComment = document.getElementById("postComment");
const commentBox = document.getElementById("commentBox");


window.addEventListener("click", () => {
    const comment = commentInput.value;
    if (!comment) return;
    handlePostComment(comment);
})


// handlePostComment function
const handlePostComment = (comment) => {
    const data = {
        username: user,
        comment: comment
    }
    appendToLi(data);
    commentInput.value = "";
    broadcastComment(data);
    syncWithDB(data)

}

// appendToLi
const appendToLi = (data) => {
    commentBox.innerHTML += `
    <li  class="comments">
    <div>
    <h1>${data.username}</h1>
</div>
<p>${data.comment}</p>
<p>${Date.now()}</p>
  </li>
    `
}

// broadcastComment
const broadcastComment = (data) => {
    socket.emit("comment", data);
}

socket.on("comment", (data) => {
    appendToLi(data)
})

let timerId = null;
function debounce(func, timer) {
    if(timerId){
        clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
        func()
    }, timer)
}

const typingBox = document.getElementById("typing");
socket.on("typing", (data) => {
    typingBox.innerHTML = `${data.username} is typing...`
    debounce(function () {
        typingBox.innerHTML = ""
    }, 1000)
})



commentInput.addEventListener("keyup", () => {
    const data = { username: user };
    socket.emit("typing", data)
   
})

const syncWithDB = async(data) => {
   const res = await fetch('/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
    const responseData = res.json();
}

const getComments = async() => {
    const res = await fetch('/api/comment', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    const responseData = await res.json();
    console.log(responseData)
}


window.onload = getComments()

