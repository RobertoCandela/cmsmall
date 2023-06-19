import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./droppable";

import SubjectRoundedIcon from "@mui/icons-material/SubjectRounded";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import PhotoSizeSelectActualRoundedIcon from "@mui/icons-material/PhotoSizeSelectActualRounded";
import { IconButton, Typography } from "@mui/material";
import { Header } from "./header";
import { Paragraph } from "./paragraph";

import { Image } from "./image";

import { HighlightOffRounded } from "@mui/icons-material";

export function Canvas({ destinationItems, setDestinationItems }) {
  const [sourceItems, setSourceItems] = useState([
    {
      id: "h",
      content: "<h>Header</h>",
      title: "Header",
      icon: <TextFieldsRoundedIcon />,
    },
    {
      id: "p",
      content: "<p>Paragraph</p>",
      title: "Paragraph",
      icon: <SubjectRoundedIcon />,
    },
    {
      id: "img",
      content: "<img>Image</img>",
      title: "Image",
      icon: <PhotoSizeSelectActualRoundedIcon />,
    },
  ]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const draggedItem =
      result.source.droppableId === "source"
        ? sourceItems[sourceIndex]
        : destinationItems[sourceIndex];

    if (result.destination.droppableId === "destination") {
      const updatedDestinationItems = [...destinationItems];
      if (result.source.droppableId !== "destination") {
        updatedDestinationItems.splice(destinationIndex, 0, {
          id: uuidv4(),
          content: '',
          blockType: draggedItem.id
        });
      } else {
        const [removedItem] = updatedDestinationItems.splice(sourceIndex, 1);
        updatedDestinationItems.splice(destinationIndex, 0, removedItem);
      }
      setDestinationItems(updatedDestinationItems);
    }
  };

  function discardItem(id) {
    const aux = destinationItems.filter((i) => i.id != id);
    setDestinationItems(aux);
  }

  function handleSelectedImage(path, item_id) {
    console.log("path: " + path);

    console.log("item_id: " + item_id);
    const aux = [...destinationItems]
    aux.forEach(e=>{
      if(e.id===item_id){
        e.content=path
      }
    })
    setDestinationItems(aux)
  }
  function handleSelectedItem(content,item_id){
    console.log("content: " + content);

    console.log("item_id: " + item_id);
    const aux = [...destinationItems]
    aux.forEach(e=>{
      if(e.id===item_id){
        e.content=content
      }
    })
    setDestinationItems(aux)

  }

  function renderItem(item) {
    //Render logic here
    console.log(item);
    switch (item.blockType) {
      case "h": {
        console.log("header");
        return (
          <Header item={item} discardItem={() => discardItem(item.id)}  handleSelectedItem={(content)=>handleSelectedItem(content,item.id)}></Header>
        );
      }
      case "p": {
        console.log("paragraph");
        return (
          <Paragraph
            item={item}
            discardItem={() => discardItem(item.id)}
            handleSelectedItem={(content)=>handleSelectedItem(content,item.id)}
          ></Paragraph>
        );
      }
      case "img": {
        console.log("image");

        return (
          <Image
            item={item}
            discardItem={() => discardItem(item.id)}
            handleSelectedImage={(path) => handleSelectedImage(path, item.id)}
          ></Image>
        );
      }
      default: {
        console.log("Not a valid render item");
      }
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <StrictModeDroppable droppableId="destination">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={{
                width: "60%",
                // minHeight: '400px',
                border: snapshot.isDraggingOver
                  ? "2px dashed #27374D"
                  : "1px dashed #ccc",
                marginRight: "50px",
                // overflow: 'auto', height: '100vh'
              }}
              {...provided.droppableProps}
            >
              {destinationItems.length === 0 ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    opacity: 0.3,
                    backgroundColor: "#C8CBCF",
                  }}
                >
                  Drag here components
                </div>
              ) : (
                destinationItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: "none",
                          margin: "0 0 8px 0",
                          backgroundColor: "#fff",
                          border: "1px solid #ddd",
                          position: "relative",
                          ...provided.draggableProps.style,
                        }}
                      >
                        {renderItem(item)}
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
        <StrictModeDroppable droppableId="source" isDropDisabled>
          {(provided) => (
            <div
              ref={provided.innerRef}
              style={{
                width: "200px",
                minHeight: "400px",
                marginRight: "20px",
              }}
              {...provided.droppableProps}
            >
              <h3>Components</h3>
              {sourceItems.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        display: "flex",
                        userSelect: "none",
                        padding: "16px",
                        margin: "0 0 8px 0",
                        backgroundColor: "#fff",
                        border: "1px dashed #ddd",
                        ...provided.draggableProps.style,
                      }}
                    >
                      {item.icon}
                      <Typography sx={{ marginLeft: "3px" }}>
                        {" "}
                        {item.title}{" "}
                      </Typography>
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
}
