import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export interface ITodo {
  id: number;
  text: string;
}

export interface IToDoState {
  // consider scalability
  [key: string]: ITodo[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "To Do": [],
    Doing: [],
    Done: [],
  },
  effects_UNSTABLE: [persistAtom],
});

export const BoardState = atom<string[]>({
  key: "boards",
  default: ["To Do", "Doing", "Done"],
  effects_UNSTABLE: [persistAtom],
});
