import React from "react";

interface ApplyAceLogoProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

const ApplyAceLogo: React.FC<ApplyAceLogoProps> = ({ 
  size = "medium", 
  className = "" 
}) => {
  return (
    <div className={`logo logo-${size} ${className}`}>
      <div className="logo-icon">🎯</div>
      <h1 className="logo-text">APPLYACE</h1>
    </div>
  );
};

export default ApplyAceLogo; 