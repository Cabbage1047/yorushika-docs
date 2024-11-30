const CONFIG_FILE = "_script/config.md";
const ROOT_DIR = "root";
const ALBUM_DIR = "dir";
const ALBUM_FALLBACK = "others";
const DEBUG_LOG = true;

const config = dv.page(CONFIG_FILE).file.frontmatter;
const rootPath = config[ROOT_DIR];

function info(...msg) {
  if (!DEBUG_LOG) return;
  console.log(...msg);
}

function warn(...msg) {
  if (!DEBUG_LOG) return;
  console.warn(...msg);
}

function error(...msg) {
  if (!DEBUG_LOG) return;
  console.error(...msg);
}

function trackInfo() {
  const folder = dv.current().file.folder.split("/").pop();
  const file = dv.current().file.name;
  return [file, folder];
}

function audioFilePath(album, track) {
  const albumConfig = config[album] || config[ALBUM_FALLBACK];
  if (!albumConfig) {
    error(`${album} not found and no fall back.`);
    return;
  }
  const albumPath = albumConfig[ALBUM_DIR];
  const trackFile = albumConfig[track];
  return `${rootPath}/${albumPath}/${trackFile}`;
}

async function loadAudio(args) {
  const [trackTitle, albumTitle] = trackInfo();
  if (!trackTitle) {
    dv.el(
      "b",
      `${trackTitle} from ${albumTitle} not found. Please check config.md`
    );
    return;
  }
  const path = audioFilePath(albumTitle, trackTitle);
  info('loading track', trackTitle, '/', albumTitle, 'at', path);
  
  const src = window.app.vault.adapter.getResourcePath(path);
  dv.el("audio", null, {
    attr: { src: src, controls: true, controlslist: "nodownload" },
  });
}

loadAudio(input);
