"use client";

import {
	Center,
	Heading,
	useToast,
	Button,
	FormControl,
	Flex,
	Stack,
	useColorModeValue,
	HStack,
	PinInput,
	PinInputField,
	Text,
	Container,
	Image,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axiosInstance";
type VerifyProps = {};

const Verify: React.FC<VerifyProps> = () => {
	const [isOtp, setIsOtp] = useState<string[]>(["", "", "", "", "", ""]);
	const [resendDisabled, setResendDisabled] = useState<boolean>(false);
	const [timer, setTimer] = useState<number>(30);
	const toast = useToast();
	const router = useNavigate();
	const mobileNumber = Cookies.get("mobileNumber");

	const handleVerify = async () => {
		try {
			const response = await axiosInstance.post<{ success: boolean }>(
				"api/otp/verify",
				{
					identifier: mobileNumber,
					userEnteredOTP: Number(isOtp.join("")),
				},
			);

			console.log("Verification Response:", response.data);
			console.log(response.data);
			if (response.data.success) {
				toast({
					title: "Verification Success",
					status: "success",
					duration: 3000,
					position: "top",
					isClosable: true,
				});
				router("/success");
			} else {
				toast({
					title: "Verification Failed",
					status: "warning",
					duration: 3000,
					position: "top",
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: "Verification Failed",
				status: "error",
				duration: 3000,
				position: "top",
				isClosable: true,
			});
			console.error("Error verifying OTP:", error);
		}
	};

	const handleResend = async () => {
		try {
			setResendDisabled(true);
			setTimer(30);

			const storedMobileNumber = Cookies.get("mobileNumber");
			console.log(storedMobileNumber);
			await axiosInstance.post("api/otp/generate", {
				identifier: `${mobileNumber}`,
			});
			toast({
				title: "OTP Resent",
				status: "success",
				duration: 3000,
				position: "top",
				isClosable: true,
			});
		} catch (error) {
			setResendDisabled(false);
			toast({
				title: "Resend Failed",
				status: "error",
				duration: 3000,
				position: "top",
				isClosable: true,
			});
			console.error("Error resending OTP:", error);
		}
	};

	useEffect(() => {
		const mobile = Cookies.get("mobileNumber");
		if (!mobile) {
			router("/");
		}
	}, []);

	useEffect(() => {
		let intervalId: any;

		if (resendDisabled) {
			intervalId = setInterval(() => {
				setTimer((prevTimer) => {
					if (prevTimer === 1) {
						setResendDisabled(false);
						clearInterval(intervalId);
						return 0;
					} else {
						return prevTimer - 1;
					}
				});
			}, 1000);
		}

		return () => clearInterval(intervalId);
	}, [resendDisabled]);

	return (
		<Flex
			height={"100vh"}
			align={"center"}
			justify={"center"}
			bg={"#ffffff"}
		>
			<Stack
				spacing={4}
				w={"full"}
				maxW={"xl"}
				bg={useColorModeValue("white", "gray.700")}
				rounded={"xl"}
				p={6}
			>
				<Center>
					<Image
						src="https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR3PB2FSZ9OS04t-pEKAsT7pVqjh3p3JT-RoyvE6rnLdz0x8HQ9"
						alt="Masai Logo"
					/>
				</Center>

				<Center>
					<Heading
						lineHeight={1.1}
						fontSize={{ base: "2xl", md: "3xl" }}
					>
						OTP Verification
					</Heading>
				</Center>
				<Center
					fontSize={{ base: "sm", sm: "md" }}
					color={useColorModeValue("gray.800", "gray.400")}
				>
					Enter the verification code we just sent on your mobile
					number
				</Center>
				<Center
					fontSize={{ base: "sm", sm: "md" }}
					fontWeight="bold"
					color={useColorModeValue("gray.800", "gray.400")}
				>
					{mobileNumber}
				</Center>
				<FormControl>
					<Center>
						<HStack>
							<PinInput
								size={"lg"}
								placeholder=""
								value={isOtp.join("")}
								onChange={(value: any) => {
									const otpArray = value
										.split("")
										.map((digit: string) => digit);
									setIsOtp(otpArray);
								}}
							>
								{Array.from({ length: 6 }, (_, index) => (
									<PinInputField
										color={"black"}
										key={index}
										bgColor={"rgb(243, 243, 243)"}
									/>
								))}
							</PinInput>
						</HStack>
					</Center>
				</FormControl>
				<Stack spacing={6}>
					<Button
						onClick={handleVerify}
						bg={"#0265ff"}
						color={"white"}
						_hover={{
							bg: "blue.500",
						}}
						isDisabled={
							isOtp.some((value) => value === "") ||
							isOtp.length !== 6
						}
						// size="sm"
						margin={"auto"}
						w={"sm"}
						rounded={"20px"}
					>
						Verify
					</Button>
				</Stack>
				<Container
					display={"flex"}
					justifyContent={"center"}
					fontSize={"14px"}
					gap={"2"}
				>
					<Center>
						{" "}
						<Text>Didn't receive the code ?</Text>
					</Center>
					<Button
						variant="unstyled"
						// paddingX={2}
						fontSize="13px"
						fontWeight="600"
						color="#0265ff"
						border={"none"}
						outline={"none"}
						_hover={{
							border: "none",
							outline: "none",
							cursor: "pointer",
							color: "blue.400",
						}}
						onClick={handleResend}
						isDisabled={resendDisabled}
					>
						Resend {resendDisabled ? `(${timer}s)` : ""}
					</Button>
				</Container>
			</Stack>
		</Flex>
	);
};

export default Verify;
