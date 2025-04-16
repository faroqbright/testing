import React, { useEffect, useState } from "react";
import Img from "../Img/Img";
import AddPost from "./AddPost";
import { toast } from "sonner";

interface AddPostProps {
  fetchPostFn: () => void;
}

export const AddModel: React.FC<AddPostProps> = ({ fetchPostFn }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleModal = () => {
    if (isAuthenticated) {
      setIsModalOpen(!isModalOpen);
    } else {
      toast.error("Please login to add a post");
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    setIsAuthenticated(!!auth);
  }, []);

  return (
    <div>
      <div className="relative bg-[#439B45] py-4 px-6 rounded-t-xl flex flex-row items-center justify-between">
        <h2 className="text-white font-bold text-[28px]">Trends</h2>
        <button
          onClick={toggleModal}
          className="py-1 px-4 bg-white text-gray-700 rounded-[26px] font-medium text-[20px]"
        >
          Add Post
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed z-10 overflow-y-auto top-0 w-full left-0">
          <div className="flex items-center justify-center min-height-100vh pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-900 opacity-75" />
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div
              className="inline-block align-center bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white shadow-md px-4 pt-5 pb-4 sm:p-6 sm:pb-4 relative">
                <button className="absolute top-[15px] right-[15px]" title="close" onClick={toggleModal}>
                  <Img src={"/assets/imgs/icons/close.png"} height={20} width={20} alt="X" />
                </button>
                <AddPost
                  fetchPostFn={fetchPostFn}
                  onClose={() => {
                    toggleModal();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
