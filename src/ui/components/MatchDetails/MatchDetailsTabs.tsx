import { MatchData } from "@/@types";
import Img from "../Img/Img";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import Loading from "@/app/loading";

interface MatchDetailsInfoTabProps {
  matchInfo: MatchData["matchInfo"];
}

export const MatchDetailsInfoTab: React.FC<MatchDetailsInfoTabProps> = ({ matchInfo }) => {
  return (
    <div className="my-2 flex flex-col gap-3">
      <div className="bg-white w-full flex place-items-center justify-center p-4 rounded-xl">
        <div className="flex place-items-center justify-between gap-2">
          <Img src={"/assets/imgs/icons/calendar.svg"} width={30} height={30} alt="match" />
          <p className="line-clamp-1">{matchInfo?.series.name || "N/A"}</p>
        </div>
      </div>
      <div className="bg-white flex-col md:flex-row w-full flex place-items-center justify-between md:justify-between p-4 rounded-xl">
        <div className="flex place-items-center justify-between gap-2">
          <Img src={"/assets/imgs/icons/trohpy.svg"} width={30} height={30} alt="match" />
          <p className="line-clamp-1">{matchInfo?.matchDescription || "N/A"}</p>
        </div>
        <div className="flex place-items-center justify-between gap-2">
          <Img src={"/assets/imgs/icons/location.svg"} width={30} height={30} alt="match" />
          <p>{matchInfo?.venue.city || "N/A"}</p>
        </div>
      </div>
      <div className="bg-white w-full flex place-items-center justify-between p-4 rounded-xl">
        <div className="flex place-items-center justify-between gap-2">
          <p className="line-clamp-1">{matchInfo?.date || "N/A"}</p>
        </div>
        <div className="flex place-items-center justify-between gap-2">
          <p>{convertToLocalDate(matchInfo?.time) || "N/A"}</p>
        </div>
      </div>
      <div className="bg-white w-full flex place-items-center justify-between p-4 rounded-xl">
        <div className="flex flex-col justify-between gap-2">
          <p className="line-clamp-1">Umpire 1</p>
          <p className="line-clamp-1">Umpire 2</p>
          <p className="line-clamp-1">Umpire 3</p>
        </div>
        <div className="flex place-items-center justify-between gap-2">
          <div className="flex flex-col justify-between gap-2">
            <p className="line-clamp-1">{matchInfo?.umpire1.name || "N/A"}</p>
            <p className="line-clamp-1">{matchInfo?.umpire2.name || "N/A"}</p>
            <p className="line-clamp-1">{matchInfo?.umpire3.name || "N/A"}</p>
          </div>
        </div>
      </div>
      <div className="bg-white flex-col md:flex-row w-full flex place-items-center justify-between md:justify-between p-4 rounded-xl">
        <div className="flex place-items-center justify-between gap-2">
          <Img src={"/assets/imgs/icons/dice.svg"} width={30} height={30} alt="match" />
          <p className="line-clamp-1">{matchInfo?.tossResults.tossWinnerName || "N/A"}</p>
        </div>
        <div className="flex place-items-center justify-between gap-2">
          <Img src={"/assets/imgs/icons/refree.png"} title="refree" width={30} height={30} alt="match" />
          <p>{matchInfo?.referee.name || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

interface MatchDetailsLiveTabProps {}

export const MatchDetailsLiveTab: React.FC<MatchDetailsLiveTabProps> = () => {
  const { id } = useParams<{ id: string }>();
  const SOCKET_URL = "https://backend.stage.cricap.com/";

  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [roomId, setRoomId] = useState<number | null>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const [messageTimestamps, setMessageTimestamps] = useState<number[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("auth") || "{}")?.jwt;

    if (!token) {
      setModalVisible(true);
      return;
    }

    const socketInstance = io(SOCKET_URL, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    setSocket(socketInstance);

    socketInstance.on("newMessage", (message: any) => {
      setMessagesList((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    const getMatchChatRoom = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/chat/chat-room/details/${id}`);

        if (response?.status === 200) {
          setRoomId(response?.data?.roomId);
          const chatHistoryResponse = await axios.get(
            `${BASE_URL}/chat/chat-room/messages/${response?.data?.roomId}?page=1&pageSize=10`
          );

          if (chatHistoryResponse?.status === 200) {
            setMessagesList(chatHistoryResponse?.data?.messages.reverse());
          }
        }
      } catch (error) {
        console.error("Error fetching chat room or history:", error);
      }
    };

    getMatchChatRoom();
  }, []);

  const handleSend = () => {
    const token = JSON.parse(localStorage.getItem("auth") || "{}")?.jwt;

    if (!token) {
      setModalVisible(true);
      return;
    }

    if (!message.trim()) {
      console.warn("Cannot send an empty message");
      return;
    }

    if (!roomId) {
      console.warn("Chat room not available");
      return;
    }

    const now = Date.now();
    setMessageTimestamps((prev) => {
      const recent = prev.filter((timestamp) => now - timestamp < 60000);
      if (recent.length >= 5) {
        alert("You are sending messages too quickly. Please wait a moment.");
        return prev;
      }
      return [...recent, now];
    });

    const payload = { chatRoomId: roomId, content: message };

    socket?.emit("sendMessage", payload, (ack: any) => {
      if (!ack?.success) {
        console.error("Failed to send message:", ack);
      }
    });

    setMessage("");
  };

  const renderEmptyList = () => (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-500 text-lg">
        {roomId ? "No messages yet. Start the conversation!" : "No chat room found for this match"}
      </p>
    </div>
  );
  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop = scrollableRef.current.scrollHeight;
    }
  }, [messagesList]); // Trigger when messagesList changes

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-100 via-white to-gray-200">
      {roomId ? (
        <>
          {/* Scrollable messages container */}
          <div ref={scrollableRef} className="flex-1 overflow-y-auto p-6">
            {messagesList.length > 0
              ? messagesList.map((item: any) => (
                  <div key={item.id} className="flex items-start mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#419743] via-[#6dbf70] to-[#a8e063] rounded-full flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-white font-bold text-xl">
                        {item?.user?.username?.substring(0, 2).toUpperCase() || "U"}
                      </span>
                    </div>
                    <div className="bg-white text-gray-900 rounded-lg p-4 max-w-xs shadow-xl transition-all duration-300 transform hover:scale-105">
                      <p className="text-sm">{item.content}</p>
                    </div>
                  </div>
                ))
              : renderEmptyList()}
          </div>

          {/* Message input */}
          <div className="flex items-center p-4 mb-1 border-t border-gray-300 bg-white shadow-md">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 border border-gray-300 rounded-full px-6 py-3 text-lg focus:outline-none focus:ring-1 focus:ring-[#419743] focus:border-[#419743] transition duration-300 focus:bg-gradient-to-r"
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-[#419743] via-[#6dbf70] to-[#a8e063] text-white rounded-full px-8 py-3 ml-4 text-lg font-semibold shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </>
      ) : (
        renderEmptyList()
      )}
    </div>
  );
};

import React, { useEffect, useRef, useState } from "react";
import ServerError from "../Error/ServerError";
import { getMatchTeamDetailsAPI } from "@/api/methods/auth";
import { useParams } from "next/navigation";
import { BASE_URL } from "@/api/config";
import { convertToLocalDate } from "@/utils/converttimeonly";


interface HighlightProps {
  matchId: string | number;
  matchData?: any;
  socket?: any;
}

export const MatchDetailsHighlightTab: React.FC<HighlightProps> = ({ matchId, socket }) => {
  const [highlights, setHighlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [decimalId, setDecimalId] = useState<string | null>(null);

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("decimalid");
    setDecimalId(id);
  }, []);

  useEffect(() => {
    fetchHighlights();
  }, [matchId]);

  useEffect(() => {
    if (!socket || !decimalId) return;

    socket.emit("subscribeMatch", {
      matchId: decimalId,
      types: ["commentary"],
    });

    const handleMatchUpdate = (data: any) => {
      let newHighlights;

      if (data?.commentary?.commentaries?.inns1 != null) {
        newHighlights = {
          highlightsText: `${data?.commentary?.current_over}.${data?.commentary?.current_over_balls} ${data?.commentary?.commentaries?.inns1[0]?.commentary}`
        };
      } else if (data?.commentary?.commentaries?.inns2 != null) {
        newHighlights = {
          highlightsText: `${data?.commentary?.current_over}.${data?.commentary?.current_over_balls} ${data?.commentary?.commentaries?.inns2[0]?.commentary}`
        };
      } else if (data?.commentary?.commentaries?.inns3 != null) {
        newHighlights = {
          highlightsText: `${data?.commentary?.current_over}.${data?.commentary?.current_over_balls} ${data?.commentary?.commentaries?.inns3[0]?.commentary}`
        };
      } else if (data?.commentary?.commentaries?.inns4 != null) {
        newHighlights = {
          highlightsText: `${data?.commentary?.current_over}.${data?.commentary?.current_over_balls} ${data?.commentary?.commentaries?.inns4[0]?.commentary}`
        };
      }

      if (newHighlights) {
        setHighlights(prevHighlights => [newHighlights, ...prevHighlights]);
      }
    };

    socket.on('matchUpdate', handleMatchUpdate);

    return () => {
      socket.off('matchUpdate', handleMatchUpdate);
    };
  }, [socket, decimalId]);

  const fetchHighlights = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/mongo/matches/${matchId}/highlights`);
      const flattenedHighlights = response?.data?.flatMap((inning: any) => inning.highlightList);
      setHighlights(flattenedHighlights || []);
    } catch (error) {
      console.error('Error fetching highlights:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderHighlightItem = (item: any, index: number) => {
    let indicatorColor = 'bg-gray-200';
    let indicatorText = '';
    let overNumber = '';

    const overMatch = item.highlightsText?.match(/(\d+(\.\d+)?)/);
    if (overMatch) {
      overNumber = overMatch[0];
    }

    if (item.highlightsText?.includes('FOUR')) {
      indicatorColor = 'bg-blue-500';
      indicatorText = '4';
    } else if (item.highlightsText?.includes('SIX')) {
      indicatorColor = 'bg-purple-600';
      indicatorText = '6';
    } else if (item.highlightsText?.includes('out') || item.highlightsText?.includes('OUT')) {
      indicatorColor = 'bg-red-500';
      indicatorText = 'W';
    }
    else if (item.highlightsText?.includes('wicket') || item.highlightsText?.includes('WICKET')) {
      indicatorColor = 'bg-red-500';
      indicatorText = 'W';
    }
    else if (item.highlightsText?.includes('5 runs') || item.highlightsText?.includes('5,')) {
      indicatorColor = 'bg-pink-500';
      indicatorText = '5';
    }

    return (
      <div key={index} className="flex flex-row items-start p-4 mb-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="flex flex-col items-center w-10 mr-4">
          {overNumber && (
            <span className="text-xs text-gray-700 mb-1">{overNumber}</span>
          )}
          {indicatorText && (
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${indicatorColor}`}>
              {indicatorText}
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-800">{item.highlightsText}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-4 bg-white rounded-lg">
      {highlights.length > 0 ? (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {highlights.map((item, index) => renderHighlightItem(item, index))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full text-center py-12 mb-10">
          <img 
            src="/assets/imgs/bg/soon.png" 
            alt="Coming Soon" 
            className="w-1/2 max-w-xs opacity-80"
          />
          <p className="mt-4 text-lg font-semibold text-gray-700">
            No highlights available yet. Check back later!
          </p>
        </div>
      )}
    </div>
  );
};


interface MatchTeamSquadsProps {
  matchDetails: MatchData;
}

export const MatchTeamsSquads: React.FC<MatchTeamSquadsProps> = ({ matchDetails }) => {
  const [team1SquadData, setTeam1SquadData] = useState<any | null>(null);
  const [team1, setTeam1] = useState<any | null>(null);
  const [team2, setTeam2] = useState<any | null>(null);
  const [team2SquadData, setTeam2SquadData] = useState<any | null>(null);
  const [error, setError] = useState(false);
  console.log(team1SquadData, "squad");
  console.log(team2SquadData, "squad2");

  useEffect(() => {
    const fetchSquadData = async () => {
      try {
        const team1Data = await getMatchTeamDetailsAPI(matchDetails.matchInfo.matchId, matchDetails.matchInfo.team1.id);
        const team2Data = await getMatchTeamDetailsAPI(matchDetails.matchInfo.matchId, matchDetails.matchInfo.team2.id);

        setTeam1SquadData(team1Data.data.players);
        setTeam2SquadData(team2Data.data.players);
        setTeam1(team1Data.data);
        setTeam2(team2Data.data);
      } catch (err) {
        setError(true);
      }
    };

    fetchSquadData();
  }, [matchDetails]);

  if (error) {
    return <ServerError />;
  }

  if (!team1SquadData || !team2SquadData) {
    return <Loading />;
  }

  console.log(team1, "squsdfgdswsdfgfdsdfgad");
  console.log(team2, "squawsdfgdefgfesdfgfedfgfewrtghgd2");
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="rounded-xl shadow-lg overflow-hidden border border-gray-300">
          <div className="bg-green-600 flex justify-between items-center p-4 px-36 text-white">
            <div className="flex items-center gap-2">
              <Img
                src={`${BASE_URL}/cricbuzz/team-flag/${team1?.teamId}?p=det&d=high`}
                width={40}
                height={30}
                alt={team1?.teamId}
                className="object-contain"
              />
              <h1 className="text-lg font-semibold">{team1?.teamName}</h1>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{team2?.teamName}</h1>
              <Img
                src={`${BASE_URL}/cricbuzz/team-flag/${team2?.teamId}?p=det&d=high`}
                width={40}
                height={30}
                alt={team2?.teamId}
                className="object-contain"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-white">
            {Array.isArray(team1SquadData?.playingXI) && team1SquadData.playingXI.length > 0 ? (
              <div className="space-y-4">
                {team1SquadData.playingXI.map((player: any) => (
                  <div
                    className="flex items-center bg-gray-50 p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    key={player?.id}
                  >
                    <div className="relative h-12 w-12 border border-gray-400 rounded-full overflow-hidden">
                      <Img
                        src={`${BASE_URL}/cricbuzz/get-image/${player?.faceImageId}?p=det&d=high`}
                        fill
                        alt={`${player?.name}`}
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="font-semibold text-sm line-clamp-1">{player?.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{player?.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No players available</p>
            )}
            {Array.isArray(team2SquadData?.playingXI) && team2SquadData.playingXI.length > 0 ? (
              <div className="space-y-4">
                {team2SquadData.playingXI.map((player: any) => (
                  <div
                    className="flex items-center justify-end bg-gray-50 p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    key={player?.id}
                  >
                    <div className="text-right mr-4">
                      <p className="font-semibold text-sm line-clamp-1">{player?.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{player?.role}</p>
                    </div>
                    <div className="relative h-12 w-12 border border-gray-400 rounded-full overflow-hidden">
                      <Img
                        src={`${BASE_URL}/cricbuzz/get-image/${player?.faceImageId}?p=det&d=high`}
                        fill
                        alt={`${player?.name}`}
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No players available</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 my-7">
          <div className="rounded-xl shadow-lg overflow-hidden border border-gray-300">
            <div className="bg-green-600 flex justify-start items-center p-4 text-white">
              <h3 className="font-semibold text-lg text-center my-1">Bench</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid sm:grid-cols-2 gap-6 p-4 bg-white">
              {Array.isArray(team1SquadData?.bench) && team1SquadData.bench.length > 0 ? (
                <div className="space-y-4">
                  {team1SquadData.bench.map((player: any) => (
                    <div
                      className="flex items-center bg-gray-50 p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                      key={player?.id}
                    >
                      <div className="relative h-12 w-12 border border-gray-400 rounded-full overflow-hidden">
                        <Img
                          src={`${BASE_URL}/cricbuzz/get-image/${player?.faceImageId}?p=det&d=high`}
                          fill
                          alt={`${player?.name}`}
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold text-sm line-clamp-1">{player?.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{player?.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No bench players available for Team 1</p>
              )}

              {Array.isArray(team2SquadData?.bench) && team2SquadData.bench.length > 0 ? (
                <div className="space-y-4">
                  {team2SquadData.bench.map((player: any) => (
                    <div
                      className="flex items-center justify-end bg-gray-50 p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                      key={player?.id}
                    >
                      <div className="text-right mr-4">
                        <p className="font-semibold text-sm line-clamp-1">{player?.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{player?.role}</p>
                      </div>
                      <div className="relative h-12 w-12 border border-gray-400 rounded-full overflow-hidden">
                        <Img
                          src={`${BASE_URL}/cricbuzz/get-image/${player?.faceImageId}?p=det&d=high`}
                          fill
                          alt={`${player?.name}`}
                          className="object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">No bench players available for Team 2</p>
              )}
            </div>
          </div>
        </div>
        {team1SquadData.supportStaff.length > 0 && team2SquadData.supportStaff.length > 0 && (
          <div className="flex flex-col gap-2 mb-7">
            <div className="rounded-xl shadow-lg overflow-hidden border border-gray-300">
              <div className="bg-green-600 flex justify-start items-center p-4 text-white">
                <h3 className="font-semibold text-lg text-center my-1">Support Staff</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid sm:grid-cols-2 gap-6 p-4 bg-white">
                {Array.isArray(team1SquadData?.supportStaff) && team1SquadData.supportStaff.length > 0 ? (
                  <div className="space-y-4">
                    {team1SquadData.supportStaff.map((player: any) => (
                      <div
                        className="flex items-center bg-gray-50 p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        key={player?.id}
                      >
                        <div className="relative h-12 w-12 border border-gray-400 rounded-full overflow-hidden">
                          <Img
                            src={`${BASE_URL}/cricbuzz/get-image/${player?.faceImageId}?p=det&d=high`}
                            fill
                            alt={`${player?.name}`}
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <p className="font-semibold text-sm line-clamp-1">{player?.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{player?.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No supportStaff players available for Team 1</p>
                )}

                {Array.isArray(team2SquadData?.supportStaff) && team2SquadData.supportStaff.length > 0 ? (
                  <div className="space-y-4">
                    {team2SquadData.supportStaff.map((player: any) => (
                      <div
                        className="flex items-center justify-end bg-gray-50 p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                        key={player?.id}
                      >
                        <div className="text-right mr-4">
                          <p className="font-semibold text-sm line-clamp-1">{player?.name}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{player?.role}</p>
                        </div>
                        <div className="relative h-12 w-12 border border-gray-400 rounded-full overflow-hidden">
                          <Img
                            src={`${BASE_URL}/cricbuzz/get-image/${player?.faceImageId}?p=det&d=high`}
                            fill
                            alt={`${player?.name}`}
                            className="object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No bench players available for Team 2</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
