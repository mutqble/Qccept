import { style } from "@vanilla-extract/css";

const iconBase = style({
   borderRadius: "16777200px",
   width: "96px",
   height: "96px",
   display: "flex",
   justifyContent: "center",
   alignItems: "center",
   transition: "background-color 0.5s, box-shadow 0.5s, color 0.3s",
});

export const boltIcon = style([
   iconBase,
   {
      color: "#8F8F8F",
      backgroundColor: "#1B1B1B",
   },
]);

export const boltIconActive = style([
   iconBase,
   {
      color: "#FD9A00",
      backgroundColor: "#FE9A0020",
      boxShadow: "0px 0px 40px 0px #F59E0B30",
   },
]);

export const mainContainer = style({
   display: "flex",
   justifyContent: "center",
   alignItems: "center",
   flexDirection: "column",
   gap: "24px",
   flex: "1",
});

export const textContainer = style({
   display: "flex",
   justifyContent: "center",
   alignItems: "center",
   flexDirection: "column",
   gap: "4px",
});

export const colorGray = style({
   color: "#8F8F8F",
});

export const colorYellow = style({
   color: "#FE9A00",
});

export const mainText = style({
   fontSize: "18px",
   fontWeight: "500",
   margin: "0",
   transition: "color 0.15s",
});

export const subText = style([
   colorGray,
   {
      margin: "0",
      fontSize: "12px",
      fontWeight: "normal",
   },
]);
