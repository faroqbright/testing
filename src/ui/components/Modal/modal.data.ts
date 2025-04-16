import Login from "../auth/Login";
import SignUp from "../auth/SignUp";
import AddPost from "../Trends/AddPost";
import SessionExpiredModal from "./SessionExpiredModal";
import { ModalData } from "./types";

export const modalsData: ModalData[] = [
  { name: "login", title: "Login", component: Login },
  { name: "signup", title: "signup", component: SignUp },
  { name: "session-expired", title: "Session Expired", component: SessionExpiredModal },
  // { name: "add_post", title: "Add Post", component: AddPost },
] as const;
