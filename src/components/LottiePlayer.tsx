import Lottie from "lottie-react";

interface LottiePlayerProps {
  animationData: any;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  width?: string | number;
  height?: string | number;
}

export const LottiePlayer = ({
  animationData,
  loop = true,
  autoplay = true,
  className = "",
  width,
  height,
}: LottiePlayerProps) => {
  const style = {
    width: width || "100%",
    height: height || "100%",
  };

  return (
    <div className={className} style={style} id="lottie-container">
      <Lottie
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
      />
    </div>
  );
};

export default LottiePlayer;
