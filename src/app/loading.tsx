import Img from "@/ui/components/Img/Img";

export default function Loading() {
  return (
    <div className="w-full h-[90vh] flex justify-center place-items-center overflow-hidden">
      <Img src={"/assets/imgs/icons/logo.png"} alt="loading" height={150} width={150} className="animate-bounce" />
    </div>
  );
}
