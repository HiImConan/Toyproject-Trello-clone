import React from "react";
import { useForm } from "react-hook-form";
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { ITodo, toDoState } from "../atom";
import { useSetRecoilState } from "recoil";

const Wrapper = styled.div`
  width: 300px;
  border-radius: 5px;
  min-height: 200px;
  background-color: ${(props) => props.theme.boardColor};
  display: flex;
  flex-direction: column;
  justify-self: center;
  padding-top: 5px;
`;

const DeleteWrapper = styled.div`
  width: calc(100% - 20px);
  border-radius: 5px;
  display: flex;
  align-items: center;
  height: 50px;
  background-color: gray;
  color: white;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  padding: 10px 0px;
  font-size: 18px;
`;

interface IAreaProps {
  isDraggingOver: boolean;
  isDraggingFromThis: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

interface IForm {
  toDo: string;
}

const Form = styled.form`
  display: flex;
  width: 100%;
  justify-content: center;
  & > input {
    width: 80%;
    border: none;
    padding: 5px;
  }
`;

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

const Board = ({ toDos, boardId }: IBoardProps) => {
  const setTodos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setTodos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    setValue("toDo", "");
  };
  return (
    <>
      {boardId !== "delete" ? (
        <Wrapper>
          <Title>{boardId}</Title>
          <Form onSubmit={handleSubmit(onValid)}>
            <input
              {...register("toDo", { required: true })}
              type="text"
              placeholder={`Add task on ${boardId}.`}
            />
          </Form>
          <Droppable droppableId={boardId}>
            {(magic, snapshot) => (
              <Area
                isDraggingOver={snapshot.isDraggingOver}
                isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
                ref={magic.innerRef}
                {...magic.droppableProps}
              >
                {toDos.map((toDo, index) => (
                  <DraggableCard
                    key={toDo.id}
                    index={index}
                    toDoId={toDo.id}
                    toDoText={toDo.text}
                  />
                ))}
                {magic.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      ) : (
        <DeleteWrapper>
          <Droppable droppableId={boardId}>
            {(magic, snapshot) => (
              <Area
                isDraggingOver={snapshot.isDraggingOver}
                isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
                ref={magic.innerRef}
                {...magic.droppableProps}
              >
                <Title>Delete</Title>
                {magic.placeholder}
              </Area>
            )}
          </Droppable>
        </DeleteWrapper>
      )}
    </>
  );
};

export default Board;
