import React, { useState, useEffect } from "react";
import axios from "axios";
import Img from "next/image"; // Ensure this is imported if you're using Next.js
import { BASE_URL } from "@/api/config";

const DelProfile = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const authh = localStorage.getItem("auth");
  const userDataa = authh ? JSON.parse(authh) : null;
  const token = userDataa?.jwt;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(`${BASE_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Deleted successfully:", response.data);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  return (
    <>
      {/* <button
        className="flex gap-2 py-1 px-4 mx-3 text-center text-white rounded-[26px] font-medium text-[20px]"
        onClick={() => setIsModalVisible(true)}
      >
        <Img src="/assets/imgs/icons/setting.svg" height={25} width={25} alt="" />
        Delete
      </button> */}
      <div
        onClick={() => setIsModalVisible(true)}
        className="w-[100%] md:w-[50%] flex gap-2 items-center justify-between border-2 border-[#E7E7E7] rounded-md my-[8px] md:my-[15px] py-1 px-2 cursor-pointer"
      >
        <div className="profile-name font-semibold text-[20px] text-[#9E9E9E] ">Delete Accounts</div>
        <Img src={"/assets/imgs/icons/arrow.svg"} height={30} width={30} alt="" />
      </div>

      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 flex flex-col items-center justify-center rounded shadow-md w-[25%] h-[25%]">
            <h3 className="text-[26px] font-semibold">Confirm Delete</h3>
            <p className="font-bold lg:text-base md:text-xl text-gray-700">Do you want to delete?</p>
            <div className="mt-4 flex justify-end gap-2">
              <button className="py-2 px-4 bg-gray-300 text-black rounded" onClick={() => setIsModalVisible(false)}>
                No
              </button>
              <button
                className={`py-2 px-4 bg-red-500 text-white rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DelProfile;
