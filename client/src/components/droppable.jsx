import { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";

/*The react beautiful dnd library can't handle the Droppable component for React applications in strict mode. 
Searching in the Github issue, I have implemented this version of Droppable component that supports the strict mode. */

export const StrictModeDroppable = ({ children, droppableId, ...props }) => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Droppable droppableId={droppableId} {...props}>
      {children}
    </Droppable>
  );
};
