const youtubeRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;
const videoIdRegex = /^[A-Za-z0-9_-]{11}$/

const getYoutubeId = url => {
  const youtubeMatches = url.match(youtubeRegex);

  if(!youtubeMatches || youtubeMatches.length < 5) return false;

  const videoId = youtubeMatches[5];

  if (!videoId.match(videoIdRegex)) return false;

  return videoId;
}

export default getYoutubeId
