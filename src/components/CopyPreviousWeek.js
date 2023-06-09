import { DefaultButton, Icon } from "@fluentui/react";
import React from "react";
import useStore from "../store/useStore";
import { ContentCopyRounded } from "@mui/icons-material";

function CopyPreviousWeek({ copyPreviousWeek }) {
  const { weekStartDate } = useStore();

  const handlePreviousWeekCopy = () => {
    const currentDate = new Date(weekStartDate);

    currentDate.setUTCHours(5, 0, 0, 0);

    const startOfWeek = new Date(currentDate);
    startOfWeek.setUTCDate(currentDate.getUTCDate() - currentDate.getUTCDay());

    const previousWeekStart = new Date(startOfWeek);
    previousWeekStart.setUTCDate(startOfWeek.getUTCDate() - 7);

    const formattedPreviousWeekStart =
      previousWeekStart.toISOString().split("T")[0] + "T05:00:00Z";

    copyPreviousWeek(formattedPreviousWeekStart);
  };
  return (
    <DefaultButton
      styles={{
        root: {
          marginLeft: 10,
          border: "none",
          fontSize: "16px",
          color: "#1A6BA9",
        },
        rootHovered: { 
            backgroundColor: "transparent", 
            color: "#1A6BA9" 
        },
        rootPressed: { 
            backgroundColor: "transparent", 
            color: "#1A6BA9" 
        }
      }}
      onClick={handlePreviousWeekCopy}
    >
      {/* <Icon iconName="Copy" styles={{root: {marginRight: 10}}}/> */}
      <ContentCopyRounded sx={{ marginRight: 1.6 }} />
      Copy previous week
    </DefaultButton>
  );
}

export default CopyPreviousWeek;
