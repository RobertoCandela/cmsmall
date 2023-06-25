import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./droppable";

import SubjectRoundedIcon from "@mui/icons-material/SubjectRounded";
import TextFieldsRoundedIcon from "@mui/icons-material/TextFieldsRounded";
import PhotoSizeSelectActualRoundedIcon from "@mui/icons-material/PhotoSizeSelectActualRounded";
import { Typography } from "@mui/material";
import { Header } from "./header";
import { Paragraph } from "./paragraph";

import { Image } from "./image";

export function Canvas({ destinationItems, setDestinationItems }) {
  //source items available for dragging
  const sourceItems = [
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
  ];

  //handle the drag end event
  const handleDragEnd = (result) => {
    //check if there is a valid destination
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
        //add a new item to the destination list
        updatedDestinationItems.splice(destinationIndex, 0, {
          id: uuidv4(),
          content: "",
          blockType: draggedItem.id,
        });
      } else {
        //reorder items within the destination list
        const [removedItem] = updatedDestinationItems.splice(sourceIndex, 1);
        updatedDestinationItems.splice(destinationIndex, 0, removedItem);
      }
      setDestinationItems(updatedDestinationItems);
    }
  };

  function discardItem(id) {
    //remove item from the destination list
    const aux = destinationItems.filter((i) => i.id != id);
    setDestinationItems(aux);
  }

  function handleSelectedImage(path, item_id) {
    //update the content of the item with the selected image path
    const aux = [...destinationItems];
    aux.forEach((e) => {
      if (e.id === item_id) {
        e.content = path;
      }
    });
    setDestinationItems(aux);
  }

  function handleSelectedItem(content, item_id) {
    //update the content of the item
    const aux = [...destinationItems];
    aux.forEach((e) => {
      if (e.id === item_id) {
        e.content = content;
      }
    });
    setDestinationItems(aux);
  }

  function renderItem(item) {
    //render different components based on the blockType
    switch (item.blockType) {
      case "h": {
        return (
          //render a Header component
          <Header
            item={item}
            discardItem={() => discardItem(item.id)}
            handleSelectedItem={(content) =>
              handleSelectedItem(content, item.id)
            }
          ></Header>
        );
      }
      case "p": {
        return (
          //render a Paragraph component
          <Paragraph
            item={item}
            discardItem={() => discardItem(item.id)}
            handleSelectedItem={(content) =>
              handleSelectedItem(content, item.id)
            }
          ></Paragraph>
        );
      }
      case "img": {
        return (
          //render an Image component
          <Image
            item={item}
            discardItem={() => discardItem(item.id)}
            handleSelectedImage={(path) => handleSelectedImage(path, item.id)}
          ></Image>
        );
      }
      default: {
        console.log("not a valid render item");
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
                border: snapshot.isDraggingOver
                  ? "2px dashed #27374D"
                  : "1px dashed #ccc",
                marginRight: "50px",
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
                  Drop here components
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
              <h3>components</h3>
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
                        {item.title}
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
