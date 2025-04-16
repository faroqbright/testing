import type { HTMLAttributes } from "react";
import React, { useEffect } from "react";
import SeriesSectionWrapper from "./SeriesSectionWrapper";
import MakeTabs from "../Navigation/MakeTabs";
import { allSeriesTabsData } from "./allSeriesTabs.data";
import ServerError from "../Error/ServerError";
import useSWR from "swr";
import { useQueryState } from "nuqs";
import Img from "../Img/Img";
import Loading from "@/app/loading";
import { BASE_URL } from "@/api/config";
import axios from "axios";

interface SeriesRankingSectionProps extends HTMLAttributes<HTMLDivElement> {}

const fetchTeamsList = async (type: string) => {
  if (!type) return null; // Avoid making API calls with undefined params
  try {
    const response = await axios.get(`${BASE_URL}/mongo/teams/list`, {
      params: { type },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const SeriesRankingSection: React.FC<SeriesRankingSectionProps> = () => {
  const tabName = "ranking-type";
  const [currentCategory] = useQueryState(tabName);

  const { data, isLoading, error, mutate } = useSWR(
    currentCategory ?? "", // Ensure a string is always passed
    () => (currentCategory ? fetchTeamsList(currentCategory) : null),
    { revalidateOnFocus: false, revalidateIfStale: true }
  );

  // Force re-fetch when category changes
  useEffect(() => {
    if (currentCategory) mutate();
  }, [currentCategory, mutate]);

  console.log("Category:", currentCategory, "Data:", data);

  return (
    <SeriesSectionWrapper>
      <MakeTabs tabName={tabName} tabsData={allSeriesTabsData} tabsType="secondary" />
      {isLoading ? (
        <Loading />
      ) : error ? (
        <ServerError />
      ) : (
        <div className="bg-white w-full">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data?.list) ? (
                data.list.map((rank: any, index: number) => (
                  <tr key={rank?.teamId}>
                    <td>{index + 1}</td>
                    <td className="flex place-items-center gap-2">
                      <Img
                        src={`${BASE_URL}/cricbuzz/get-image/${rank?.imageId}?p=det&d=high`}
                        height={25}
                        width={30}
                        className="min-h-[25px] min-w-[30px] rounded-sm border border-gray-300"
                        alt=""
                      />
                      <span>{rank?.teamName}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center">
                    No rankings available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </SeriesSectionWrapper>
  );
};

export default SeriesRankingSection;
