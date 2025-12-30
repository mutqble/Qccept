import { style } from "@vanilla-extract/css";

export const footerStyle = style({
   justifyContent: "space-between",
   alignItems: "center",
   display: "flex",
   padding: "24px",
   backgroundColor: "#1B1B1B30",
   borderTop: "1px solid #29292950",
   fontSize: "0.75rem", //12px
   color: "#8F8F8F",
});

export const center = style({
   display: "flex",
   justifyContent: "center",
   alignItems: "center",
   gap: "6px",
});

export const dotRed = style({
   color: "#BB061E",
});

export const dotGreen = style({
   color: "#00BC7D",
});
