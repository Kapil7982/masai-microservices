"use client";

import React, { useState } from "react";
import {
	Button,
	Flex,
	Heading,
	Input,
	Stack,
	Text,
	HStack,
	useColorModeValue,
	Spinner,
	useToast,
	Center,
	Image,
	VStack,
	Box,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";

interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
	const [isMobile, setIsMobile] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const toast = useToast();
	const navigate = useNavigate();

	const handleSubmit = async () => {
		try {
			setIsLoading(true);
			const res = await axiosInstance.post(`api/otp/generate`, {
				identifier: isMobile,
			});
			console.log(res.data);

			Cookies.set("mobileNumber", isMobile);

			toast({
				title: "OTP Sending Please Wait",
				description: `We are sending an OTP to ${isMobile}.`,
				status: "warning",
				duration: 1000,
				position: "top",
				isClosable: true,
			});

			setTimeout(() => {
				setIsLoading(false);
				toast({
					title: "OTP Sent",
					description: `We've Sent and OTP to ${isMobile}.`,
					status: "success",
					duration: 3000,
					position: "top",
					isClosable: true,
				});
				navigate("/verify");
			}, 3000);
		} catch (error) {
			console.log(error);
			setIsLoading(false);
			toast({
				title: "Enter Correct Mobile Number",
				description: "error",
				status: "error",
				position: "top",
				isClosable: true,
			});
		}
	};

	return (
		<Flex minH={"100vh"} align={"center"} justify={"center"} bg={"#ffffff"}>
			<Stack
				spacing={4}
				w={"full"}
				maxW={"md"}
				bg={useColorModeValue("white", "gray.700")}
				rounded={"xl"}
				p={6}
				my={12}
			>
				<Center>
					<Image
						src="https://masai-website-images.s3.ap-south-1.amazonaws.com/logo.png"
						alt="Masai Logo"
					/>
				</Center>
				<Heading lineHeight={1.1} fontSize={{ base: "4xl", md: "3xl" }}>
					Welcome
				</Heading>
				<Text
					pb="5"
					fontSize={{ base: "sm", sm: "md" }}
					color={useColorModeValue("gray.800", "gray.400")}
				>
					You&apos;ll get an OTP to your Mobile Number
				</Text>
				<Center
					position="absolute"
					top="41%"
					left="50%"
					transform="translateX(-50%)"
					zIndex="1"
				>
					<Image
						top="px"
						bg="white"
						boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
						rounded="100"
						p={2}
						height="14vh"
						src="/mobileinhand.svg"
						alt="Masai Logo"
					/>
				</Center>
				<Box position="relative" width="full" height="250px">
					<VStack
						rounded="0px 0px 20px 20px"
						spacing="5"
						pb="5"
						position="absolute"
						bg="gray.100"
						width="100%"
						height="100%"
						clipPath="polygon(0 20%, 100% 0%, 100% 100%, 0% 100%)"
						zIndex="0"
					>
						<Text fontWeight="500" pt="20">
							Enter your mobile number
						</Text>
						<HStack id="mobile" display="flex" spacing="5">
							<Input
								maxLength={10}
								textAlign="center"
								bg="white"
								rounded="20px"
								onChange={(e) => setIsMobile(e.target.value)}
								placeholder="Your Mobile Number"
								_placeholder={{ color: "gray.500" }}
								type="string"
								value={isMobile}
							/>
						</HStack>
						<Stack spacing={6} width="full" p="5">
							<Button
								mb="5px"
								position="relative"
								onClick={handleSubmit}
								rounded={"20px"}
								bg={"rgb(52, 112, 228)"}
								color={"white"}
								outline={"0"}
								_hover={{
									bg: "blue.500",
								}}
							>
								{isLoading ? <Spinner /> : "Login"}
							</Button>
						</Stack>
					</VStack>
				</Box>
			</Stack>
		</Flex>
	);
};

export default Login;
