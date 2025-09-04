console.log("let start js");

let currentsong = new Audio();
let songs = [];
let currentfolder = "";

// All playlists hardcoded here
let playlists = {
  "ncs": [
    "HangoverSong.mp3",
    "MurderAye.mp3",
    "SanjuKARHAI.mp3"

  ],
  "Angry_(mood)": [
    "Haveli.mp3",
    "thokar.mp3"
  ],
  "Sidhu Moosewala": [
    "0008sid.mp3",
    "TakeNote.mp3"
  ],
  "Chill_(mood)": [
    "AZUL.mp3",
    "ThodiSi.mp3"
  ],
  "Dark_(mood)": [
    "DardAurDava.mp3",
    "MAUT.mp3"
  ],
  "Diljit": [
    "case.mp3",
    "Goat.mp3"
  ],
  "Tarna": [
    "BlackBall.mp3",
    "DayNight.mp3"
  ],
  "karan aujla": [
    "MFGABHRU.mp3",
    "Peace.mp3"
  ],
  "Love_(mood)": [
    "JeeneLagaHoon.mp3",
    "PehleBhiMain.mp3"
  ],
  "Uplifting_(mood)": [
    "Baari.mp3",
    "Paarchanaa.mp3"
  ],
  "cs": [
    "COMPUTER.mp3",
    "Topboy.mp3"
  ]
};

// Convert seconds to mm:ss
function secondsToMinutesSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsRemaining = Math.floor(seconds % 60);
  return `${minutes}:${secondsRemaining.toString().padStart(2, "0")}`;
}

// Render songs from playlist
function getSongs(folder) {
  currentfolder = "songs/" + folder;
  songs = playlists[folder];
  let songUL = document.querySelector(".songlist ul");
  songUL.innerHTML = "";

  for (const song of songs) {
    songUL.innerHTML += `
      <li>
        <img class="invert" src="img/music.svg" alt="music">
        <div class="info"><div>${song}</div></div>
        <div class="playnow">
          <span>Play Now</span>
          <img class="invert" src="img/play.svg" alt="play">
        </div>
      </li>`;
  }

  Array.from(songUL.getElementsByTagName("li")).forEach((e, index) => {
    e.addEventListener("click", () => {
      playMusic(songs[index]);
      play.src = "img/pause.svg";
    });
  });
  return songs;
}

// Play music
function playMusic(track, pause = false) {
  currentsong.src = `${currentfolder}/${track}`;
  if (!pause) {
    currentsong.play();
  }
  play.src = "img/play.svg";
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

// Display album cards (hardcoded covers + descriptions)
function displayAlbums() {
  let albums = [
    { folder: "ncs", title: "NCS Collection", description: "Non-copyrighted tracks", cover: "songs/ncs/cover.jpg" },
    { folder: "Angry_(mood)", title: "Angry Mood", description: "Energetic beats", cover: "songs/Angry_(mood)/cover.jpeg" },
    { folder: "Sidhu Moosewala", title: "Sidhu Moosewala Songs", description: "Sidhu Moosewala for you", cover: "songs/Sidhu Moosewala/cover.webp" }, 
    
    { folder: "Chill_(mood)", title: "Chill Mood", description: "Relax & enjoy", cover: "songs/Chill_(mood)/cover.jpg" },
    { folder: "Dark_(mood)", title: "Dark Mood", description: "Deep intense tracks", cover: "songs/Dark_(mood)/cover.jpg" },
    { folder: "Diljit", title: "Diljit Hits", description: "Punjabi Vibes", cover: "songs/Diljit/cover.jpg" },
    { folder: "Tarna", title: "Go  Tarna", description: "Lets go  Tarna", cover: "songs/Tarna/cover.webp" },
    { folder: "karan aujla", title: "Karan Aujla", description: "Best of Karan", cover: "songs/karan aujla/cover.jpg" },
    { folder: "Love_(mood)", title: "Love Mood", description: "Romantic tracks", cover: "songs/Love_(mood)/cover.jpg" },
    { folder: "Uplifting_(mood)", title: "Uplifting Mood", description: "Feel good songs", cover: "songs/Uplifting_(mood)/cover.jpg" },
    { folder: "cs", title: "Copyright Songs", description: "Cover Songs for you", cover: "songs/cs/cover.jpeg" }
  ];

  let cardContainer = document.querySelector(".cardContainer");
  cardContainer.innerHTML = "";

  for (const album of albums) {
    cardContainer.innerHTML += `
      <div data-folder="${album.folder}" class="card">
        <div class="play"><img src="img/play2.svg" alt="play"></div>
        <img src="${album.cover}" alt="mood">
        <h2>${album.title}</h2>
        <p>${album.description}</p>
      </div>`;
  }

  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", (item) => {
      songs = getSongs(item.currentTarget.dataset.folder);
      playMusic(songs[0]);
      play.src = "img/pause.svg";
    });
  });
}

// Main app
function main() {
  getSongs("ncs");
  playMusic(songs[0], true);
  displayAlbums();

  // Play / Pause
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "img/pause.svg";
    } else {
      currentsong.pause();
      play.src = "img/play.svg";
    }
  });

  // Progress bar
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML =
      `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  // Seek
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (percent * currentsong.duration) / 100;
  });

  // Sidebar open/close
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0px";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  // Previous
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
      play.src = "img/pause.svg";
    }
  });

  // Next
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    } else {
      playMusic(songs[0]);
    }
    play.src = "img/pause.svg";
  });

  // Volume slider
  document.querySelector(".volume input").addEventListener("change", (e) => {
    currentsong.volume = parseInt(e.target.value) / 100;
  });

  // Volume mute/unmute
  document.querySelector(".volume > img").addEventListener("click", (e) => {
    if (e.target.src.includes("img/volume.svg")) {
      e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg");
      currentsong.volume = 0;
      document.querySelector(".volume input").value = 0;
    } else {
      e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg");
      currentsong.volume = 0.5;
      document.querySelector(".volume input").value = 50;
    }
  });
}

main();

let signupbtn=document.querySelector(".signupbtn");
signupbtn.addEventListener("click",()=>{
    window.location.href="index.html";
})

let loginbtn=document.querySelector(".loginbtn");
loginbtn.addEventListener("click",()=>{
    window.location.href="index.html";
})
let homebtn=document.querySelector(".home");
homebtn.addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-120%";
})