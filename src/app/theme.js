const color = {
  brown: "rgb(177, 175, 101)",
  brownLight: "rgb(210, 207, 118)",
  brownDark: "rgb(151, 149, 87)",
  green: "green",
  greenHigh: "rgb(47, 228, 41)",
  greenHighHover: "rgb(47, 228, 41)",
  greenNormal: "rgba(0, 128, 0, 0.6)",// find better names
  greenNormalHover: "rgba(0, 128, 0, 0.4)",// find better names
  lightGray: "rgb(233, 228, 253)",
  gray: "rgba(128, 128, 128, 0.5)",
  grayer: "rgba(128, 128, 128, 0.7)",
  red: "red",
  redHigh: "rgb(206, 37, 37)",
  redHighHover: "rgb(236, 43, 43)",
  redNormal: "rgba(255, 0, 0, 0.6)",// find better names
  redNormalHover: "rgba(255, 0, 0, 0.4)",// find better names
  yellow: "yellow"
};

export default {
  base: {
    gutter: 8,
    borderRadius: 20
  },
  font: {
    size: 16,
    ["header-1"]: "0.75em",
    header1: "1em",
    header2: "1.25em",
    header3: "1.5em",
    header4: "1.75em",
    header5: "2em",
    header6: "2.25em"
  },
  color: {
    ...color,
    divider: color.gray,
    error: color.redHigh,
    errorHover: color.redHighHover,
    errorActive: color.redHighHover,
    impressed: color.greenNormal,
    impressedHover: color.greenNormalHover,
    meh: color.redNormal,
    mehHover: color.redNormalHover,
    rateActive: color.grayer,
    rateActiveHover: color.gray,
    ok: color.greenHigh,
    okHover: color.greenHighHover,
    okActive: color.greenHighHover,
    warn: color.yellow,
    zebraRow: color.lightGray
  }
};
