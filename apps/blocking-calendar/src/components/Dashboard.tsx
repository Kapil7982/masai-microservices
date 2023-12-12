import logo from "../google-meet.svg";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiArrowRight } from "react-icons/fi";
import { IoMdArrowDropdown } from "react-icons/io";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
	Grid,
	GridItem,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Alert,
	AlertIcon,
	Box,
	Heading,
	Text,
	Button,
	Spinner,
} from "@chakra-ui/react";

import { MdArrowRight, MdArrowDropDown } from "react-icons/md";
import Dropdown from "./Dropdown";
import Form from "./Form";
import UpdateForm2 from "./UpdateForm";

const itemsPerPage = 1;

const Dashboard = (): JSX.Element => {
	interface TimeDisplayProps {
		time: Date;
	}
	interface DateDisplayProps {
		date: string;
	}
	interface Event {
		eventId: string;
		event_ID: string;
		summary: string;
		description: string;
		endTime: any;
		startTime: any;
		startDateTime: any;
		endDateTime: any;
		location: string;
		attendees: any;
		start: any;
		meetLink: any;
		end: any;
	}
	const [events, setEvents] = useState<Event[]>([]);
	const [formData, setFormData] = useState({
		summary: "",
		description: "",
		startDateTime: "",
		endDateTime: "",
		location: "",
		attendees: [],
	});
	const [dropdownStates, setDropdownStates] = useState(
		Array(events.length).fill(false),
	);
	const [iconStates, setIconStates] = useState(
		Array(events.length).fill(true),
	);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const finalRef = React.useRef(null);
	const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
	const [editModalIsOpen, setEditModalIsOpen] = useState(false);

	const openEditModal = () => setEditModalIsOpen(true);
	const closeEditModal = () => setEditModalIsOpen(false);

	// const [alert, setAlert] = useState({
	//   status: null,
	//   message: "",
	// });

	const [loading, setLoading] = useState(false);

	// ======================== pegination

	const [currentPage, setCurrentPage] = useState(1);
	const maxPages = Math.ceil(events.length / itemsPerPage);

	const isAtFirstPage = currentPage === 1;
	const isAtLastPage = currentPage === maxPages;

	const paginatedEvents = events.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);
	// ================================ pegination function

	const handleNextPage = () => {
		if (currentPage < maxPages) {
			setCurrentPage(currentPage + 1);
		}
	};

	const handlePrevPage = () => {
		if (currentPage > 1) {
			setCurrentPage(currentPage - 1);
		}
	};

	// ============================= pegination functions ended

	useEffect(() => {
		// we Replace 'example@gmail.com' with the desired user email in the backend
		const userEmail = "officialsiddharthbisht@gmail.com";

		setLoading(true);
		// Make a GET request to the backend API to fetch events
		fetch(`http://localhost:8080/event/list-events/${userEmail}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(userEmail);
				console.log("Events:", data);
				setLoading(false);
				setEvents(data || []); // Ensure that data.items is defined, otherwise use an empty array
			})
			.catch((error) => console.error("Error fetching events:", error));
	}, []);

	const handleDropdownToggle = (index: number) => {
		const updatedStates = [...dropdownStates];
		const updatedIconStates = [...iconStates];

		updatedStates[index] = !updatedStates[index];
		updatedIconStates[index] = !updatedIconStates[index];

		setDropdownStates(updatedStates);
		setIconStates(updatedIconStates);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		if (
			name === "startDateTime" &&
			new Date(value) > new Date(formData.endDateTime)
		) {
			setFormData({
				...formData,
				endDateTime: value,
				[name]: value,
			});
		} else if (
			name === "endDateTime" &&
			new Date(value) < new Date(formData.startDateTime)
		) {
			// Ensure endDateTime is not smaller than startDateTime
			setFormData({
				...formData,
				startDateTime: value,
				[name]: value,
			});
		} else if (name === "startDateTime") {
			setFormData({
				...formData,
				[name]: value,
			});
		} else {
			setFormData({
				...formData,
				[name]: value,
			});
		}
	};

	const getCurrentDateTime = () => {
		const now = new Date();
		const year = now.getFullYear();
		const month = `${now.getMonth() + 1}`.padStart(2, "0"); // Month is 0-indexed
		const day = `${now.getDate()}`.padStart(2, "0");
		const hours = `${now.getHours()}`.padStart(2, "0");
		const minutes = `${now.getMinutes()}`.padStart(2, "0");

		return `${year}-${month}-${day}T${hours}:${minutes}`;
	};

	const TimeDisplay: React.FC<TimeDisplayProps> = ({ time }) => {
		const parsedDate = new Date(time);
		const formattedTime = parsedDate.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
		});

		return (
			<div>
				<p>{formattedTime}</p>
			</div>
		);
	};

	const DateDisplay: React.FC<DateDisplayProps> = ({ date }) => {
		// Parse the input datetime string
		const parsedDate = new Date(date);

		// Format date as "dd MMM yyyy"
		const formattedDate = parsedDate.toLocaleDateString([], {
			day: "2-digit",
			month: "short",
			year: "numeric",
		});

		return (
			<div>
				<p>{formattedDate}</p>
			</div>
		);
	};

	const handleUpdateEvent = async (eventId: string, updatedData: any) => {
		console.log("151", eventId);
		console.log("Ratikanta");
		try {
			// const startDateTimeISO = new Date(formData.startDateTime).toISOString();
			// const endDateTimeISO = new Date(formData.endDateTime).toISOString();

			const startDateTimeISO = new Date(updatedData.startDateTime);
			const endDateTimeISO = new Date(updatedData.endDateTime);

			console.log("155", eventId);
			console.log(formData);

			const linesArray = updatedData.attendees.split("\n");
			const arrayOfObjects = linesArray.map((line: string) => {
				const [email, content] = line.split(": "); // Split each line into email and content
				return { email, input: content }; // Create an object with email and input properties
			});

			console.log("163", updatedData);

			const response = await axios.post(
				`http://localhost:8080/event/update-event/${eventId}`,
				{
					summary: updatedData.summary,
					description: updatedData.description,
					startDateTime: startDateTimeISO,
					endDateTime: endDateTimeISO,
					location: updatedData.location,
					attendees: arrayOfObjects,
				},
			);

			console.log(response.data); // Log the response from the backend
			events.forEach((element: Event, index) => {
				console.log("element", 11, updatedData);
				if (element.eventId == eventId) {
					element.summary = updatedData.summary;
					element.description = updatedData.description;
					element.startDateTime = startDateTimeISO;
					element.endDateTime = endDateTimeISO;
					// element.startDateTime= startDateTimeISO
					// element.endDateTime= endDateTimeISO
					element.location = updatedData.location;
					element.attendees = arrayOfObjects;
				}
			});
			setEvents([...events]);
			alert("Event updated successfully");
			closeEditModal();
			// setAlert({ status: "success", message: "Event updated successfully" });
			// setTimeout(() => {
			//   setAlert({ status: null, message: "" });
			// }, 5000);
		} catch (error: any) {
			console.error("Error creating event:", error.message);
			alert("Error updated event");
		}
	};

	const handleEditClick = (event: Event) => {
		setSelectedEvent(event);
		openEditModal();
	};

	const handleDeleteEvent = (event_ID: string) => {
		fetch(`http://localhost:8080/event/delete-event/${event_ID}`)
			.then((response) => {
				console.log("deletedddddd");
				setEvents(
					events.filter((element) => element.eventId !== event_ID),
				);
				alert(`${event_ID} Deleted successfully`);
				onClose();
				
			})
			.catch((error) => {
				console.log("error indelete");
				alert(`${event_ID} not deleted`);
			});
	};

	const handleCloseAlert = () => {
		// Handle close button click
		// setAlert({ status: null, message: "" });
	};

	const isValidURL = (str: string) => {
		try {
			new URL(str);
			return true;
		} catch (error) {
			return false;
		}
	};

	return (
		<Box className="dashboard-container">
			{loading ? (
				<Spinner
					thickness="4px"
					speed="0.65s"
					emptyColor="gray.200"
					color="purple.500"
					size="xl"
					mt={"250px"}
					mb={"250px"}
				/>
			) : (
				<Grid
					className="grid-container"
					gridTemplateColumns={{
						sm: "repeat(1, 1fr)",
						md: "repeat(2, 1fr)",
						lg: "repeat(3, 1fr)",
					}}
				>
					{paginatedEvents.map((item: Event, index) => (
						<GridItem key={item.event_ID} className="grid-item">
							<Box w={"90%"} maxW={"300px"}>
								<Box h={{ sm: "40px", md: "40px", lg: "40px" }}>
									<Heading size="md">{item.summary}</Heading>
								</Box>

								<Box className="linkbox">
									{item.meetLink &&
									item.meetLink.conferenceId ? (
										<>
											<img
												style={{ width: "20px" }}
												src={logo}
												alt="Google Meet Logo"
											/>
											<br />
											<a
												style={{
													fontSize: "13px",
													color: "blue",
												}}
												href={`https://meet.google.com/${item.meetLink.conferenceId}`}
											>
												<Text>
													{item.meetLink.conferenceId}
												</Text>
											</a>
										</>
									) : (
										<Text></Text>
									)}
								</Box>

								{/* box for metting place */}

								<Box height={"25px"}>
									{isValidURL(item.location) ? (
										<a
											href={item.location}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Button
												colorScheme="blue"
												size="sm"
												p={5}
											>
												Join with Zoom link
											</Button>
										</a>
									) : (
										<Text
											fontSize="sm"
											fontWeight={"100"}
											color="gray"
										>
											{item.location}
										</Text>
									)}
								</Box>

								<br />
								<Box className="timebox">
									<Heading size="md">
										<TimeDisplay time={item.start} />
									</Heading>
									<Heading size="md">
										{<FiArrowRight />}
									</Heading>
									<Heading size="md">
										<TimeDisplay time={item.end} />
									</Heading>
								</Box>
								<Box className="timebox" pb={"1rem"}>
									<Text
										fontSize="sm"
										fontWeight={"100"}
										color="gray"
									>
										<DateDisplay date={item.start} />
									</Text>
								</Box>
								<h5
									style={{
										textAlign: "start",
										fontSize: "14px",
									}}
								>
									Description :
								</h5>
								<Box
									className="description_box"
									display={"flex"}
									justifyContent={"start"}
									maxHeight={{
										sm: "40px",
										md: "90px",
										lg: "110px",
									}}
									minHeight={{
										sm: "40px",
										md: "40px",
										lg: "100px",
									}}
									pb={"1rem"}
									pl={1}
									mt={1}
									maxW={"320px"}
									// border={"1px solid red"}
								>
									<Text
										fontSize="sm"
										fontWeight={"600"}
										color="gray.600"
										textAlign={"start"}
										width={"100%"}
										overflow={"scroll"}
										overflowX={"hidden"}
										height={"100px"}
										pt={1}
									>
										{item.description}
									</Text>
								</Box>

								{/* Place for link */}

								{/* <br /> */}
								<Box className="dropdownBox">
									<Text fontSize="sm" mt={6}>
										{" "}
										Attendees:
									</Text>
									<button
										className="dropdownBtn"
										onClick={() =>
											handleDropdownToggle(index)
										}
									>
										{iconStates[index] ? (
											<MdArrowDropDown />
										) : (
											<MdArrowRight />
										)}
									</button>
									{dropdownStates[index] && (
										<Dropdown>
											<ol
												style={{
													textAlign: "left",
													paddingInlineStart: "0",
												}}
											>
												{item.attendees.map(
													(
														email: any,
														emailIndex: number,
													) => (
														<li
															key={emailIndex}
															style={{
																fontSize:
																	"14px",
															}}
														>
															{email.email}
														</li>
													),
												)}
											</ol>
										</Dropdown>
									)}
								</Box>
								<br />

								<Box className="timebox">
									<Button
										className="fontbtn"
										colorScheme="purple"
										// colorScheme={"green"}
										pl={"40px"}
										pr={"40px"}
										onClick={() => handleEditClick(item)}
									>
										Edit
									</Button>
									<Modal
										finalFocusRef={finalRef}
										isOpen={editModalIsOpen}
										onClose={closeEditModal}
										size={"xl"}
									>
										<ModalOverlay
											bg="blackAlpha.300"
											// backdropFilter="blur(10px) hue-rotate(90deg)"
										/>
										<ModalContent>
											<ModalHeader>
												Edit Event
											</ModalHeader>
											<ModalCloseButton />
											<ModalBody>
												{selectedEvent && (
													<UpdateForm2
														getCurrentDateTime={
															getCurrentDateTime
														}
														eventData={
															selectedEvent
														}
														closeEditModal={
															closeEditModal
														}
														handleUpdateEvent={
															handleUpdateEvent
														}
													/>
												)}
											</ModalBody>

											<ModalFooter></ModalFooter>
										</ModalContent>
									</Modal>
									<Button
										className="fontbtn"
										colorScheme="red"
										pl={"30px"}
										pr={"30px"}
										onClick={onOpen}
									>
										Delete
									</Button>
									<Modal
										finalFocusRef={finalRef}
										isOpen={isOpen}
										onClose={onClose}
									>
										<ModalOverlay />
										<ModalContent>
											<ModalHeader>
												Delete Event
											</ModalHeader>
											<ModalCloseButton />
											<ModalBody>
												<Text>
													Are you sure, you want to
													delete this event
												</Text>
											</ModalBody>

											<ModalFooter>
												<Button
													variant="ghost"
													mr={3}
													onClick={onClose}
												>
													Cancel
												</Button>
												<Button
													onClick={() => {
														handleDeleteEvent(
															item.eventId,
														);
													}}
													colorScheme="red"
												>
													Delete
												</Button>
											</ModalFooter>
										</ModalContent>
									</Modal>
								</Box>
							</Box>
						</GridItem>
					))}
				</Grid>
			)}

			<br />
			<Box
				mt={4}
				display="flex"
				justifyContent="center"
				alignItems="center"
			>
				<Button
					colorScheme={isAtFirstPage ? "gray.400" : "purple"}
					onClick={handlePrevPage}
					disabled={isAtFirstPage}
					color={isAtFirstPage ? "gray.400" : "white"}
				>
					Previous
				</Button>
				<Text mx={4}>
					Page {currentPage} of {maxPages}
				</Text>
				<Button
					colorScheme={isAtLastPage ? "gray.400" : "purple"}
					onClick={handleNextPage}
					disabled={isAtLastPage}
					color={isAtLastPage || maxPages == 0? "gray.400" : "white"} 
				>
					Next
				</Button>
			</Box>
		</Box>
	);
};

export default Dashboard;
