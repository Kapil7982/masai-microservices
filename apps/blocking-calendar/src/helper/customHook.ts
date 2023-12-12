import { useToast } from "@chakra-ui/react";
export const useCustomToast = () => {
	const toast = useToast();
	const showToast = (message,status) => {
		toast({
			title: message,
			status:status,
            position:"top",
			duration: 3000,
			isClosable: true,
		});
	};
    return showToast
};
