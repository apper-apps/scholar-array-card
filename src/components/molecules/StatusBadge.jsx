import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, type = "default" }) => {
  const getVariant = () => {
    if (type === "attendance") {
      switch (status?.toLowerCase()) {
        case "present": return "success";
        case "absent": return "error";
        case "tardy": return "warning";
        default: return "default";
      }
    }
    
    if (type === "grade") {
      const letter = getLetterGrade(status);
      switch (letter) {
        case "A": return "success";
        case "B": return "info";
        case "C": return "warning";
        case "D": return "warning";
        case "F": return "error";
        default: return "default";
      }
    }

    switch (status?.toLowerCase()) {
      case "active": return "success";
      case "inactive": return "error";
      case "pending": return "warning";
      default: return "default";
    }
  };

  const getLetterGrade = (score) => {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  const displayText = type === "grade" ? getLetterGrade(status) : status;

  return (
    <Badge variant={getVariant()}>
      {displayText}
    </Badge>
  );
};

export default StatusBadge;