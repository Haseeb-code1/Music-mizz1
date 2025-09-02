console.log("let start js");

let currentsong = new Audio();
let songs;
let currentfolder;
function secondsToMinutesSeconds(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsRemaining = Math.floor(seconds % 60);
  return `${minutes}:${secondsRemaining.toString().padStart(2, "0")}`;
}

async function getSongs(folder) {
  currentfolder = folder;
  let a = await fetch(`https://calm-kelpie-009832.netlify.app/${folder}/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let songUL = document
    .querySelector(".songlist")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li>
    
                       <img  class="invert" src="img/music.svg" alt="music">

                        <div class="info">
<div>
    ${song.replaceAll("%20", " ")}</div>
    
                        </div>
                        <div class="playnow">
                            <span>Play Now</span>
                        
                        <img class="invert" src="img/play.svg" alt="play">
                         </div>

    
    
    </li>`;
  }
  Array.from(
    document.querySelector(".songlist").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
      play.src = "img/pause.svg";
    });
  });
  return songs;
}
const playMusic = (track, pause = false) => {
  currentsong.src = `/${currentfolder}/` + track;
  if (!pause) {
    currentsong.play();
  }

  play.src = "img/play.svg";
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00.00 / 00.00";
};

async function displayAlbums() {
  let a = await fetch(`https://calm-kelpie-009832.netlify.app/songs/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  console.log(anchors);
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    console.log(e);
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-1)[0];
      console.log(folder);

      let a = await fetch(
        `https://calm-kelpie-009832.netlify.app/songs/${folder}/info.json`
      );
      let response = await a.json();
      console.log(response);
      cardContainer.innerHTML =
        cardContainer.innerHTML +
        `<div   data-folder="${folder}" class="card ">
                        <div   class="play">

                            <img src="img/play2.svg" alt="play">

                        </div>
                        <img src="/songs/${folder}/cover.jpg" alt="mood">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`;
    }
  }
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
      play.src = "img/pause.svg";
    });
  });
}

async function main() {
  await getSongs("songs/ncs");
  playMusic(songs[0], true);

  displayAlbums();

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "img/pause.svg";
    } else {
      currentsong.pause();
      play.src = "img/play.svg";
    }
  });
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentsong.currentTime
    )}/${secondsToMinutesSeconds(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (percent * currentsong.duration) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0px";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);

      play.src = "img/pause.svg";
    }
  });
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);

    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    } else {
      playMusic(songs[0]); // start again from first
    }
    play.src = "img/pause.svg";
  });
  document
    .querySelector(".volume")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentsong.volume = parseInt(e.target.value) / 100;
    });

  document.querySelector(".volume >img").addEventListener("click", (e) => {
    if (e.target.src.includes("img/volume.svg")) {
      e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg");
      currentsong.volume = 0;

      document
        .querySelector(".volume")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace = ("img/mute.svg", "img/volume.svg");
      currentsong.volume = 0.1;
    }
  });
}

main();

