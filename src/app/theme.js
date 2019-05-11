const color = {
  brown: "rgb(177, 175, 101)",
  brownLight: "rgb(210, 207, 118)",
  brownDark: "rgb(151, 149, 87)",
  red: "red",
  redHigh: "rgb(206, 37, 37)",
  redHighHover: "rgb(236, 43, 43)",
  green: "green",
  greenHigh: "rgb(47, 228, 41)",
  greenHighHover: "rgb(47, 228, 41)",
  yellow: "yellow"
};

export default {
  base: {
    gutter: 8,
    borderRadius: 20
  },
  font: {
    size: 16,
    header1: "1em",
    header2: "1.25em",
    header3: "1.5em",
    header4: "1.75em",
    header5: "2em",
    header6: "2.25em"
  },
  color: {
    ...color,
    error: color.redHigh,
    errorHover: color.redHighHover,
    ok: color.greenHigh,
    okHover: color.greenHighHover,
    warn: color.yellow
  }
};
