import EditProfile from "@/ui/components/Profile/EditProfile";
import ProfilePage from "@/ui/components/Profile/ProfilePage";
import React from "react";

interface pageProps {}

const page: React.FC<pageProps> = ({ ...props }) => {
  return <EditProfile />;
};
export default page;
