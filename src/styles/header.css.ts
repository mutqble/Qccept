import { style } from "@vanilla-extract/css";

export const headerStyle = style({
   justifyContent: "space-between",
   alignItems: "center",
   display: "flex",
   padding: "24px",
   backgroundColor: "#1B1B1B30",
   borderBottom: "1px solid #29292950",
});

export const logo = style({
   display: "flex",
   alignItems: "center",
   fontWeight: "bold",
   gap: "8px",
   fontSize: "20px",
});

export const versionTag = style({
   borderRadius: "10px",
   border: "1px solid #FE9A0050",
   padding: "2px 8px",
});

export const versionText = style({
   fontSize: "16px",
   fontWeight: "500",
   color: "#FD9A00",
   // margin: "2px 8px",
});
