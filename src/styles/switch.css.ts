import { style } from "@vanilla-extract/css";

export const switchRoot = style({
   height: "56px",
   width: "112px",
   display: "flex",
   alignItems: "center",
});

export const switchControl = style({
   borderRadius: "16777200px",
   backgroundColor: "#1B1B1B",
   height: "100%",
   width: "100%",
   display: "flex",
   alignItems: "center",
   padding: "6px",
   transition: "background-color 0.3s",
   selectors: {
      "&[data-state='checked']": {
         backgroundColor: "#FE9A00",
         boxShadow: "0px 0px 20px 0px #F59E0B50",
      }
   }
});

export const switchThumb = style({
   borderRadius: "16777200px",
   backgroundColor: "#0D0D0D",
   height: "44px",
   width: "44px",
   transition: "transform 0.3s",
   selectors: {
      "&[data-state='checked']": {
         transform: "translateX(130%)",
      }
   }
});


