import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './droppable';

export function Canvas(){
  const [sourceItems, setSourceItems] = useState([
    { id: 'item-1', content: 'Elemento 1' },
    { id: 'item-2', content: 'Elemento 2' },
    { id: 'item-3', content: 'Elemento 3' },
  ]);

  const [destinationItems, setDestinationItems] = useState([]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const draggedItem = result.source.droppableId === 'source'
      ? sourceItems[sourceIndex]
      : destinationItems[sourceIndex];
      
    if (result.destination.droppableId === 'destination') {
      const updatedDestinationItems = [...destinationItems];
      if (result.source.droppableId !== 'destination') {
        updatedDestinationItems.splice(destinationIndex, 0, {
          id: uuidv4(),
          content: draggedItem.content,
        });
      } else {
        const [removedItem] = updatedDestinationItems.splice(sourceIndex, 1);
        updatedDestinationItems.splice(destinationIndex, 0, removedItem);
      }
      setDestinationItems(updatedDestinationItems);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ display: 'flex' }}>
        <StrictModeDroppable droppableId="source" isDropDisabled>
          {(provided) => (
            <div
              ref={provided.innerRef}
              style={{
                width: '200px',
                minHeight: '400px',
                border: '1px solid #ccc',
                marginRight: '20px',
              }}
              {...provided.droppableProps}
            >
              <h3>Elementi</h3>
              {sourceItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        padding: '16px',
                        margin: '0 0 8px 0',
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        ...provided.draggableProps.style,
                      }}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
        <StrictModeDroppable droppableId="destination">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={{
                width: '300px',
                minHeight: '400px',
                border: snapshot.isDraggingOver ? '2px solid green' : '1px solid #ccc',
              }}
              {...provided.droppableProps}
            >
              <h3>Container</h3>
              {destinationItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        userSelect: 'none',
                        padding: '16px',
                        margin: '0 0 8px 0',
                        backgroundColor: '#fff',
                        border: '1px solid #ddd',
                        ...provided.draggableProps.style,
                      }}
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </div>
    </DragDropContext>
  );
};