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

const instanceOfToDo = (object: any): object is IToDo => {
  return (
    object.constructor === Object &&
    "id" in object &&
    "text" in object &&
    typeof (object as IToDo).id === "number" &&
    typeof (object as IToDo).text === "string"
  );
};

const instanceOfBoard = (object: any): object is IBoard[] => {
  return (
    object.constructor === Object &&
    "id" in object &&
    "title" in object &&
    "toDos" in object &&
    typeof (object as IBoard).id === "number" &&
    typeof (object as IBoard).title === "string" &&
    (object as IBoard).toDos.every((toDo) => instanceOfToDo(toDo))
  );
};

const instanceOfBoards = (object: any): object is IBoard[] => {
  return (
    Array.isArray(object) &&
    (object as IBoard[]).every((board) => instanceOfBoard(board))
  );
};

const localStorageEffect =
  (key: string) =>
  ({ setSelf, onSet }: any) => {
    const data = localStorage.getItem(key);

    if (data !== null && data !== undefined) {
      const json = (raw: string) => {
        try {
          return JSON.parse(raw);
        } catch (error) {
          return false;
        }
      };

      if (json(data) && instanceOfBoards(json(data))) {
        setSelf(json(data));
      }
    }

    onSet((newValue: IBoard[]) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    });
  };

export const toDosState = atom<IBoard[]>({
  key: "toDos",
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
  effects: [localStorageEffect("trello-clone-todos")],
});

export const isLightState = atom<boolean>({
  key: "isLight",
  default: window.matchMedia("(prefers-color-scheme: light)").matches
    ? true
    : false,
});
