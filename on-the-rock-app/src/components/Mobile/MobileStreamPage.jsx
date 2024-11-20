import StreamingVideo from "./MobileStreamingVideo";

const MobileStreamingPage = () => {
	return (
		<div className="bg-white top-[16vh] relative box-border flex flex-col items-center">
			<div className="relative w-full">
				<StreamingVideo />
			</div>
		</div>
	);
};

export default MobileStreamingPage;
