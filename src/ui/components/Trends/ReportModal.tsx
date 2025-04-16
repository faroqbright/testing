import React, { useState } from "react";
import Img from "../Img/Img";

interface ReportModalProps {
  postId: string;
  userId: string;
  onClose: () => void;
  onSubmit: (reportData: ReportData) => void;
}

interface ReportData {
  reportType: string;
  reason: string;
  contentId: string;
  reportedBy: string;
}

const ReportModal: React.FC<ReportModalProps> = ({ postId, userId, onClose, onSubmit }) => {
  const [reason, setReason] = useState<string>("");

  const reasons = ["Abusive Content", "Spam", "Misinformation", "Harassment", "Copyright Violation"];

  const handleSubmit = () => {
    if (reason) {
      onSubmit({
        reportType: "post",
        reason,
        contentId: postId,
        reportedBy: userId,
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-25 z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-80 relative">
        <button className="absolute top-[15px] right-[15px]" title="close">
          <Img src={"/assets/imgs/icons/close.png"} height={16} width={16} alt="X" onClick={onClose} />
        </button>
        <h3 className="text-lg font-semibold my-4 text-center">Why are you reporting this post?</h3>
        <div className="space-y-2">
          {reasons.map((option, index) => (
            <button
              key={index}
              onClick={() => setReason(option)}
              className={`w-full px-4 py-2 border rounded-lg text-center text-sm font-medium 
                ${reason === option ? "bg-gray-200 border-gray-400" : "bg-white border-gray-300 hover:bg-gray-200"}`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-between gap-3">
          <button className="w-1/2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500" onClick={onClose}>
            No
          </button>
          <button
            className={`w-1/2 px-4 py-2 rounded ${
              reason
                ? "bg-stateCompleted text-white hover:bg-stateCompleted"
                : "bg-blue-200 text-white cursor-not-allowed"
            }`}
            onClick={handleSubmit}
            disabled={!reason}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
