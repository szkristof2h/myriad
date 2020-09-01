const YOUTUBE_REGEX = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/
const ID_VIDEO_REGEX = /^[A-Za-z0-9_-]{11}$/

const getYoutubeId = (url: string) => {
  const youtubeMatches = url.match(YOUTUBE_REGEX)

  if (!youtubeMatches || youtubeMatches.length < 5) return false

  const videoId = youtubeMatches[5]

  if (!videoId.match(ID_VIDEO_REGEX)) return false

  return videoId
}

export default getYoutubeId
