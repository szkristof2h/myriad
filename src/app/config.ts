export default {
  url: `${process.env.SITE_URL}${
    process.env.SITE_URL?.includes("localhost") ? ":" + process.env.PORT : ""
  }`,
}
