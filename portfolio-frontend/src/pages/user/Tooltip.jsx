import React from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

/**
 * @param {{ content: React.ReactNode, placement?: "top"|"bottom"|"left"|"right", children: React.ReactNode }} props
 */
const Tooltip = ({ content, placement = "top", children }) => (
  <Tippy content={content} placement={placement}>
    {children}
  </Tippy>
);

export default Tooltip;