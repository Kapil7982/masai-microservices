import React, { useEffect } from "react";
import { Center, Text, Box, Image } from "@chakra-ui/react";

import successGif from "../assets/successgif.gif";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const SuccessPage: React.FC = () => {
	const router = useNavigate();
	useEffect(() => {
		const mobile = Cookies.get("mobileNumber");
		if (!mobile) {
			router("/");
		}
	}, []);
	return (
		<Center height="100vh">
			<Box
				w={{ base: "90%", lg: "20%" }}
				p={4}
				borderRadius="lg"
			>
				<Center>
					<Image
						src={successGif}
						alt="Success GIF"
						style={{
							color: "green.400",
						}}
					/>
				</Center>
				<Text fontSize="xl" fontWeight="bold" mt={4}>
					OTP Verified Successfully!
				</Text>
			</Box>
		</Center>
	);
};

export default SuccessPage;
