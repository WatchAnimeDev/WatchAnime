import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getAnimeTitleByRelevance, getImageByRelevance } from "../custom/AnimeData";
import { Paper, createStyles } from "@mantine/core";
import { IconMenu2 } from "@tabler/icons";
import { replaceAllWatchListData } from "../custom/WatchList";
import { useLanguageStore } from "../store/LanguageToggleStore";
import { useShallow } from "zustand/react/shallow";

const useStyles = createStyles((theme) => ({
    editWrapperParent: {
        listStyle: "none",
        paddingLeft: "0",
        height: "90vh",
        overflow: "auto",
        MsOverflowStyle: "none",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
            display: "none",
        },
    },
    editWrapperLi: {
        display: "flex",
        alignItems: "center",
        borderRadius: ".2em",
        padding: ".5em .8em .5em .5em",
        marginBottom: "1em",
    },
    editWrapperTitle: {
        maxWidth: "none",
        fontWeight: "bold",
        margin: "0",
    },
    editWrapperImageParent: {
        overflow: "hidden",
        flexShrink: "0",
        width: "65px",
        marginRight: ".5em",
        marginLeft: ".5em",
    },
    editWrapperImage: {
        display: "block",
        width: "100%",
        height: "auto",
    },
}));

function WatchListEditLayout({ watchListData, setWatchListData }) {
    const { classes } = useStyles();
    const { language } = useLanguageStore(useShallow((state) => ({ language: state.language })));
    function handleOnDragEnd(result) {
        if (!result.destination) return;

        const items = Array.from(watchListData);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setWatchListData(items);
        replaceAllWatchListData(items);
    }
    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="characters">
                {(provided) => (
                    <ul className={classes.editWrapperParent} {...provided.droppableProps} ref={provided.innerRef}>
                        {watchListData.map(({ slug, titles, images }, index) => {
                            return (
                                <Draggable key={slug} draggableId={slug} index={index}>
                                    {(provided) => (
                                        <li className={classes.editWrapperLi} ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                            <Paper>
                                                <IconMenu2 size={16} />
                                            </Paper>
                                            <div className={classes.editWrapperImageParent}>
                                                <img className={classes.editWrapperImage} src={getImageByRelevance(images)} alt={`${slug} Thumb`} />
                                            </div>
                                            <p className={classes.editWrapperTitle}>{getAnimeTitleByRelevance(titles, false, language)}</p>
                                        </li>
                                    )}
                                </Draggable>
                            );
                        })}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default WatchListEditLayout;
