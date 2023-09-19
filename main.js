const APP_ID = "0fbf6fd5beda4795abab317898ffdba5"
const TOKEN = "007eJxTYLgtnmggGXCq45xu11+WOOV5sxRPK7Xe0LqpvrKwQcw6fasCg0FaUppZWoppUmpKoom5pWliUmKSsaG5haVFWlpKUqLpw/2cqQ2BjAxh+/VZGRkgEMRnYchNzMxjYAAAB2Ue7A=="
const CHANNEL = "main"
let isRobot=confirm("Are you the robot");

const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {

    client.on('user-published', handleUserJoined)
    
    client.on('user-left', handleUserLeft)
    if(isRobot){
        localStream.switchDevice("video", "<deviceid>", console.log,console.log);
    }
    let UID = await client.join(APP_ID, CHANNEL, TOKEN, null)

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks() 

    // let player = `<div class="video-container" id="user-container-${UID}">
    //                     <div class="video-player" id="user-${UID}"></div>
    //               </div>`
    // document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    
    await client.publish([localTracks[0], localTracks[1]])
}

let joinStream = async () => {
    await joinAndDisplayLocalStream()
    document.getElementById('join-btn').style.display = 'none'
    document.getElementById('stream-controls').style.display = 'flex'
}

let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user 
    await client.subscribe(user, mediaType)

    if (mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player != null){
            player.remove()
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}"></div> 
                 </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === 'audio'){
        user.audioTrack.play()
    }
}

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream = async () => {
    for(let i = 0; localTracks.length > i; i++){
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    document.getElementById('join-btn').style.display = 'block'
    document.getElementById('stream-controls').style.display = 'none'
    document.getElementById('video-streams').innerHTML = ''
}



document.getElementById('join-btn').addEventListener('click', joinStream)