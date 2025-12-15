const coordinatesBackground = "rgba(100, 150, 100, 0.65)";
const addButtonBackground = "rgba(100, 100, 100, 0.65)";

const levaContainerBackground = `color-mix(
    in srgb,
    ${addButtonBackground},
    rgba(255, 255, 255, 0.4)
)`;

const levaTitleBackground = `color-mix(
    in srgb,
    ${coordinatesBackground} 60%,
    white
)`;

const coordinates = "rgba(60, 0, 0, 0.5)";
// const addButtonAprove = "rgba(1, 150, 1, 0.6)";

export const themeColors = {
  colors: {
    elevation1: coordinatesBackground,
    elevation2: levaContainerBackground,
    elevation3: levaTitleBackground,
    accent1: "white",
    accent2: coordinates,
    accent3: "white",
    highlight1: "#535760",
    highlight2: "white",
    highlight3: "#fefefe",
    vivid1: "white",
  },
  radii: {
    xs: "2px",
    sm: "3px",
    lg: "10px",
  },
  space: {
    sm: "6px",
    md: "10px",
    rowGap: "7px",
    colGap: "7px",
  },
  fontSizes: {
    root: "11px",
  },
  sizes: {
    rootWidth: "280px",
    controlWidth: "160px",
    scrubberWidth: "8px",
    scrubberHeight: "16px",
    rowHeight: "24px",
    folderHeight: "20px",
    checkboxSize: "16px",
    joystickWidth: "100px",
    joystickHeight: "100px",
    colorPickerWidth: "160px",
    colorPickerHeight: "100px",
    monitorHeight: "60px",
    titleBarHeight: "39px",
  },
  borderWidths: {
    root: "0px",
    input: "1px",
    focus: "1px",
    hover: "1px",
    active: "1px",
    folder: "1px",
  },
  fontWeights: {
    label: "normal",
    folder: "normal",
    button: "normal",
  },
};
