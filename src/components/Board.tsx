import React, { useState } from "react";
import {
  Droppable,
  DraggableProvided,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import DraggableCard from "./DraggableCard";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { IBoard, toDosState } from "../atom";
import { useSetRecoilState } from "recoil";

interface MaterialIconProps {
  name: string;
  Tag?: keyof JSX.IntrinsicElements;
}

export const MaterialIcon = ({ name, Tag = "div" }: MaterialIconProps) => {
  return (
    <Tag
      className="material-icons-round"
      style={{ fontSize: "inherit", userSelect: "none" }}
    >
      {name}
    </Tag>
  );
};

const Overlay = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  & > * {
    pointer-events: all;
  }
`;

const Title = styled.div`
  display: block;
  font-size: 1.6rem;
  font-weight: 600;
  width: 16rem;
  height: 4.5rem;
  padding: 1.25rem;
  border-radius: 0.8rem 0.8rem 0 0;
  transition: background-color 0.3s, color 0.3s, box-shadow 0.3s, opacity 0.3s;
  user-select: none;
  &.background {
    background-color: ${(props) => props.theme.glassColor};
    backdrop-filter: blur(0.4rem);
    box-shadow: 0 0.1rem 0.2rem rgba(0, 0, 0, 0.15);
  }
  & > h2 {
    width: 13.5rem;
    margin-top: 0.2rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    transition: width 0.3s;
  }
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  gap: 0.2rem;
  color: ${(props) => props.theme.secondaryTextColor};
  transition: opacity 0.3s;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  width: 2rem;
  height: 2rem;
  background: none;
  border: none;
  padding: 0;
  border-radius: 0.2rem;
  color: ${(props) => props.theme.secondaryTextColor};
  transition: background-color 0.3s, color 0.3s, opacity 0.3s;
  &:hover,
  &:active,
  &:focus {
    cursor: pointer;
    background-color: ${(props) => props.theme.hoverButtonOverlayColor};
  }
  &:focus {
    opacity: 1;
    outline: 0.15rem solid ${(props) => props.theme.accentColor};
  }
  &:last-child {
    cursor: grab;
  }
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 3.5rem;
  bottom: 0;
  transition: background-color 0.3s, color 0.3s, opacity 0.3s;
  & > input {
    width: 100%;
    height: 100%;
    padding: 0 1.2rem;
    border: none;
    border-radius: 0 0 0.8rem 0.8rem;
    background-color: ${(props) => props.theme.cardColor};
    box-shadow: 0 -0.1rem 0.2rem rgba(0, 0, 0, 0.15);
    font-size: 1rem;
    font-weight: 500;
    color: ${(props) => props.theme.textColor};
    transition: background-color 0.3s, box-shadow 0.3s;
  }
  & > button {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    right: 0
    width: 3.5rem;
    height: 3.5rem;
    background-color: transparent;
    border: none;
    border-radius: 0 0 0.8rem 0;
    font-size: 1.4rem;
    color: ${(props) => props.theme.accentColor};
  }
  &:focus {
    outline: 0.15rem solid ${(props) => props.theme.accentColor};
  }
  & > input:placeholder-shown + button {
    display: none;
  }
`;

interface IAreaProps {
  isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  display: flex;
  width: 16rem;
  max-height: calc(100vh - 8rem);
  position: relative;
  border-radius: 0.8rem;
  box-shadow: 0 0.3rem 0.6rem rgba(0, 0, 0, 0.15);
  margin: 0.5rem;
  background-color: ${(props) =>
    props.isDraggingOver ? props.theme.accentColor : props.theme.boardColor};
  transition: background-color 0.3s, box-shadow 0.3s;
  &.hovering {
    box-shadow: 0 0.6rem 1.2rem rgba(0, 0, 0, 0.25);
  }
  &:has(li.dragging) ${Title}.background, &.dragging ${Title}.background {
    opacity: 0;
  }
  &.dragging ${Title} {
    color: white;
    & > h2 {
      width: 13.5rem !important;
    }
  }
  &:has(li.dragging) ${Form}.end, &.dragging ${Form}.end {
    opacity: 0.5;
    & > input {
      background-color: transparent;
      box-shadow: none;
      &::placeholder {
        color: white;
      }
    }
  }
  &:not(:hover):not(:focus-within) ${Buttons}, &.dragging ${Buttons} {
    opacity: 0;
  }
  &:hover ${Title} > h2,
  &:focus-within ${Title} > h2 {
    width: 7.1rem;
  }
`;

const ToDos = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 4.5rem 0.4rem 4rem 1rem;
  width: 100%;
  max-height: calc(100vh - 11rem);
  overflow-x: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0.6rem;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${(props) => props.theme.scrollBarColor};
    border-radius: 0.3rem;
    background-clip: padding-box;
    border: 0.2rem solid transparent;
    transition: background-color 0.3s;
  }
`;

const Empty = styled.li`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.secondaryTextColor};
  font-size: 0.9rem;
  margin-top: 0.9rem;
  margin-bottom: 1.6rem;
  cursor: default;
  transition: color 0.3s;
  user-select: none;
`;

interface IForm {
  toDo: string;
}

interface IBoardProps {
  board: IBoard;
  parentProvided: DraggableProvided;
  isHovering: boolean;
  style: DraggingStyle | NotDraggingStyle;
}

const Board = ({ board, parentProvided, isHovering, style }: IBoardProps) => {
  const setToDos = useSetRecoilState(toDosState);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const onScroll = (event: React.UIEvent<HTMLUListElement>) => {
    if (event.currentTarget.scrollTop > 0) {
      console.log(event.currentTarget.scrollTop);
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
    if (
      event.currentTarget.scrollHeight - event.currentTarget.scrollTop ===
      event.currentTarget.clientHeight
    ) {
      console.log(event.currentTarget.clientHeight);
      setIsEnd(true);
    } else {
      setIsEnd(false);
    }
  };

  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    if (toDo.trim() === "") {
      return;
    }
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((prev) => {
      const toDosCopy = [...prev];
      const boardIndex = prev.findIndex((b) => b.id === board.id);
      const boardCopy = { ...prev[boardIndex] };

      boardCopy.toDos = [newToDo, ...boardCopy.toDos];
      toDosCopy.splice(boardIndex, 1, boardCopy);
      return toDosCopy;
    });
    setValue("toDo", "");
  };

  const onEdit = () => {
    const newName = window
      .prompt(`${board.title} 보드의 새 이름을 입력해주세요.`, board.title)
      ?.trim();

    if (newName !== null && newName !== undefined) {
      if (newName === "") {
        alert("이름을 입력해주세요.");
        return;
      }

      if (newName === board.title) {
        return;
      }

      setToDos((prev) => {
        const toDosCopy = [...prev];
        const boardIndex = toDosCopy.findIndex((b) => b.id === board.id);
        const boardCopy = { ...toDosCopy[boardIndex] };

        boardCopy.title = newName;
        toDosCopy.splice(boardIndex, 1, boardCopy);

        return toDosCopy;
      });
    }
  };

  const onDelete = () => {
    if (window.confirm(`${board.title} 보드를 삭제하시겠습니까?`)) {
      setToDos((prev) => {
        const toDosCopy = [...prev];
        const boardIndex = toDosCopy.findIndex((b) => b.id === board.id);

        toDosCopy.splice(boardIndex, 1);

        return toDosCopy;
      });
    }
  };
  return (
    <Droppable droppableId={"board-" + board.id} type="BOARD">
      {(provided, snapshot) => (
        <Area
          isDraggingOver={snapshot.isDraggingOver}
          className={`${snapshot.isDraggingOver ? "dragging" : ""} ${
            isHovering ? "hovering" : ""
          }`}
          ref={parentProvided.innerRef}
          {...parentProvided.draggableProps}
          style={style}
        >
          <Overlay>
            <Title className={isScrolled ? "background" : ""}>
              <h2>{board.title}</h2>
              <Buttons>
                <Button onClick={onEdit}>
                  <MaterialIcon name="edit" />
                </Button>
                <Button onClick={onDelete}>
                  <MaterialIcon name="delete" />
                </Button>
                <Button as="div" {...parentProvided.dragHandleProps}>
                  <MaterialIcon name="drag_handle" />
                </Button>
              </Buttons>
            </Title>
            <Form
              className={isEnd ? "end" : ""}
              onSubmit={handleSubmit(onValid)}
            >
              <input
                {...register("toDo", { required: true })}
                type="text"
                placeholder={`${board.title}에 추가`}
              />
              <button>
                <MaterialIcon name="add_circle" />
              </button>
            </Form>
          </Overlay>
          <ToDos
            ref={provided.innerRef}
            {...provided.droppableProps}
            onScroll={onScroll}
          >
            {board.toDos.map((toDo, index) => (
              <DraggableCard
                toDo={toDo}
                key={toDo.id}
                index={index}
                boardId={board.id}
              />
            ))}
            {board.toDos.length === 0 ? (
              <Empty>이 보드는 비어 있습니다.</Empty>
            ) : null}
            {provided.placeholder}
          </ToDos>
        </Area>
      )}
    </Droppable>
  );
};

export default Board;
