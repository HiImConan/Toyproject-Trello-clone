import { atom } from "recoil";

export interface IToDo {
  id: number;
  text: string;
}

export interface IBoard {
  id: number;
  title: string;
  toDos: IToDo[];
}

export const toDoState = atom<IBoard[]>({
  key: "toDo",
  default: [
    {
      title: "해야 함",
      id: 0,
      toDos: [
        { text: "투두리스트 클론 끝내기", id: 0 },
        { text: "내일 학교 갈 준비하기", id: 1 },
      ],
    },
    {
      title: "하는 중",
      id: 1,
      toDos: [],
    },
    {
      title: "완료",
      id: 2,
      toDos: [
        { text: "하루 4끼 먹기", id: 2 },
        { text: "공부하기", id: 3 },
      ],
    },
  ],
});

export const isLightState = atom<boolean>({
  key: "isLight",
  default: window.matchMedia("(prefers-color-scheme: light)").matches
    ? true
    : false,
});
