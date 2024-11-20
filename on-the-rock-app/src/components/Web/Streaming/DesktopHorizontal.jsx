import PropTypes from "prop-types";

// 임예원 (2024.07.22 수정)

const DesktopHorizontal = ({ className, text = "sub-title" }) => {
  return (
    <div className={`flex items-center border-b h-[75px] justify-center px-20 w-full ${className}`}>
      <div className="flex flex-col items-end justify-center">
        <div className="text-textBlack font-display font-bold text-2xl leading-9 text-center whitespace-nowrap">
          OnTheRock
        </div>
        <div className="text-textBlack font-sans font-normal text-sm leading-5 mt-[-4px] whitespace-nowrap">
          {text}
        </div>
      </div>
    </div>
  );
};

DesktopHorizontal.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
};

export default DesktopHorizontal;
