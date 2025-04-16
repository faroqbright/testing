import React, { useEffect, useState } from "react";
import Img from "../Img/Img";
import ContentEditable, { ContentEditableEvent } from "react-contenteditable";
import { Paperclip } from "react-bootstrap-icons";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { toast } from "sonner";

interface Post {
  id: number;
}

interface PostCommentsProps {
  post: Post;
  messages: { [key: string]: string };
  handleInputChange: (event: any, postId: number) => void;
  handlePostComment: (postId: number) => void;
  setMessages: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  editMode: { [key: number]: number | null };
}

const PostComments: React.FC<PostCommentsProps> = ({
  post,
  messages,
  handleInputChange,
  handlePostComment,
  setMessages,
  editMode,
}) => {
  const handlePostClick = () => {
    const authh = localStorage.getItem("auth");
    const userDataa = authh ? JSON.parse(authh) : null;
    const token = userDataa?.jwt;

    if (!token) {
      toast.error("Please login to add a post");
    } else {
      handlePostComment(post.id);
    }
  };

  return (
    <div className="w-full mb-4">
      <div className="flex items-center gap-2">
        <ul className="w-full flex items-center">
          <li className="flex-1 relative">
            <ContentEditable
              className="flex items-center py-2 px-4 rounded-lg border-2 border-[#E7E7E7]"
              tagName="article"
              html={messages[post.id] || ""}
              onChange={(event: ContentEditableEvent) => handleInputChange(event, post.id)}
            />
            {(!messages[post.id] || messages[post.id] === "") && (
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                Write the Comments...
              </span>
            )}
          </li>

          <li className="px-1">
            <label className="cursor-pointer">
              <Paperclip size={20} className="text-[#464646]" />
              <input className="hidden" type="file" />
            </label>
          </li>

          <li>
            <div className="group relative inline-block">
              <button className="w-[40px] h-[40px] p-1 text-[16px] text-white focus:outline-none">
                <Img src={"/assets/imgs/icons/mood.svg"} height={50} width={50} alt="User" />
              </button>
              <ul className="hidden group-focus-within:block list-none absolute z-1 shadow-lg animate-slideIn">
                <EmojiPicker
                  lazyLoadEmojis
                  height={400}
                  previewConfig={{
                    showPreview: false,
                  }}
                  onEmojiClick={(emojiData: EmojiClickData) => {
                    const emoji = emojiData.emoji;
                    setMessages((prevMessages) => ({
                      ...prevMessages,
                      [post.id]: (prevMessages[post.id] || "") + emoji,
                    }));
                  }}
                />
              </ul>
            </div>
          </li>
        </ul>

        <button className="text-[#464646] px-4 py-2 rounded-lg bg-[#E7E7E7] cursor-pointer" onClick={handlePostClick}>
          {editMode[post.id] != null ? "Update" : "Post"}
        </button>
      </div>
    </div>
  );
};

export default PostComments;
