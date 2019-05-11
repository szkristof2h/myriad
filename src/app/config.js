export default {
  url: `${process.env.SITE_URL}${
    process.env.NODE_ENV !== "production" ? ":" + process.env.PORT : ""
  }`
};
