import { useEffect } from 'react';

const MatchUpdates = ({ socket, matchesInfo, setFirstInningsLiveScore, setSecondInningsLiveScore, setThirdInningsLiveScore, setFourthInningsLiveScore }) => {
  
  useEffect(() => {
    if (!socket || !matchesInfo?.length) return;

    // Subscribe to matches in progress
    matchesInfo.forEach(match => {
      if (match?.state === 'In Progress') {
        socket.emit('subscribeMatch', {
          matchId: match.decimalId,
          types: ["scoreboard"],
        });
      }
    });

  }, [socket, matchesInfo]); // Only re-run when socket or matchesInfo changes

  useEffect(() => {
    if (!socket) return;

    const handleMatchUpdate = (data) => {
      console.log("data-socket-data>>", JSON.stringify(data));

      if (data?.feed_id) {
        setFirstInningsLiveScore(prev => ({
          ...prev,
          [data.feed_id]: {
            runs: data?.scoreboard?.innings1runs || 0,
            wickets: data?.scoreboard?.innings1wickets || 0,
            overs: parseFloat(data?.scoreboard?.innings1overs) || 0,
          },
        }));

        setSecondInningsLiveScore(prev => ({
          ...prev,
          [data.feed_id]: {
            runs: data?.scoreboard?.innings2runs || 0,
            wickets: data?.scoreboard?.innings2wickets || 0,
            overs: parseFloat(data?.scoreboard?.innings2overs) || 0,
          },
        }));

        setThirdInningsLiveScore(prev => ({
          ...prev,
          [data.feed_id]: {
            runs: data?.scoreboard?.innings3runs || 0,
            wickets: data?.scoreboard?.innings3wickets || 0,
            overs: parseFloat(data?.scoreboard?.innings3overs) || 0,
          },
        }));

        setFourthInningsLiveScore(prev => ({
          ...prev,
          [data.feed_id]: {
            runs: data?.scoreboard?.innings4runs || 0,
            wickets: data?.scoreboard?.innings4wickets || 0,
            overs: parseFloat(data?.scoreboard?.innings4overs) || 0,
          },
        }));
      }
    };

    // Attach listener
    socket.on('matchUpdate', handleMatchUpdate);

    // Cleanup: Remove listener when component unmounts or socket changes
    return () => {
      socket.off('matchUpdate', handleMatchUpdate);
    };

  }, [socket]); // Runs only when the socket changes

  return null; // This component doesn't render UI
};

export default MatchUpdates;
