import ProfilePage from "@/ui/components/Profile/ProfilePage";
import React from "react";

interface pageProps {}

const page: React.FC<pageProps> = ({ ...props }) => {
  return <ProfilePage />;
};
export default page;
