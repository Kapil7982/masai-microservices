import React, { useState } from "react";
import {
	Box,
	Button,
	GridItem,
	Heading,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useDisclosure,
} from "@chakra-ui/react";
import Dropdown from "./Dropdown";
import { MdArrowDropDown, MdArrowRight } from "react-icons/md";

import logo from "../google-meet.svg";
import UpdateForm from "./UpdateForm";
import { isValidURL, getCurrentDateTime } from "../helper/helper";
import { FiArrowRight } from "react-icons/fi";

const EventCard = ({
	item,
	handleDeleteEvent,
	handleUpdateEvent,
	index,
	events
}) => {
	interface TimeDisplayProps {
		time: Date;
	}
	interface DateDisplayProps {
		date: string;
	}
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
  
  const closeEditModal=() => {
    setSelectedEvent(null);
    setEditModalIsOpen(false);
  }

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
	const handleDropdownToggle = (index: number) => {
		const updatedStates = [...dropdownStates];
		const updatedIconStates = [...iconStates];

		updatedStates[index] = !updatedStates[index];
		updatedIconStates[index] = !updatedIconStates[index];

		setDropdownStates(updatedStates);
		setIconStates(updatedIconStates);
	};
	const handleEditClick = (event: Event) => {
		const clickedEvent = { ...event };
		setSelectedEvent(clickedEvent);
		setEditModalIsOpen(true);
	};
	return (
		<GridItem key={item.eventId} className="grid-item">
			<Box w={"90%"} maxW={"300px"}>
				<Box h={{ sm: "40px", md: "40px", lg: "40px" }}>
					<Heading size="md"> {item.summary}</Heading>
				</Box>

				<Box className="card-linkbox">
					{item.meetLink && item.meetLink.conferenceId ? (
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
								<Text>{item.meetLink.conferenceId}</Text>
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
							<Button colorScheme="blue" size="sm" p={5}>
								Join with Zoom link
							</Button>
						</a>
					) : (
						<Text fontSize="sm" fontWeight={"100"} color="gray">
							{item.location}
						</Text>
					)}
				</Box>

				<br />
				<Box className="timebox">
					<Heading size="md">
						<TimeDisplay time={item.start} />
					</Heading>
					<Heading size="md">{<FiArrowRight />}</Heading>
					<Heading size="md">
						<TimeDisplay time={item.end} />
					</Heading>
				</Box>
				<Box className="timebox" pb={"1rem"}>
					<Text fontSize="sm" fontWeight={"100"} color="gray">
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

				<Box className="dropdownBox2">
					<Text fontSize="sm" mt={6}>
						{" "}
						Attendees:
					</Text>
					<button
						className="dropdownBtn"
						onClick={() => handleDropdownToggle(index)}
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
									(email: any, emailIndex: number) => (
										<li
											key={emailIndex}
											style={{
												fontSize: "14px",
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
						<ModalOverlay bg="blackAlpha.300" />
						<ModalContent>
							<ModalHeader>Edit Event</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								{selectedEvent && (
									<UpdateForm
										getCurrentDateTime={getCurrentDateTime}
										eventData={selectedEvent}
										handleUpdateEvent={handleUpdateEvent}
										closeEditModal={closeEditModal}
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
							<ModalHeader>Delete Event</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Text>
									Are you sure, you want to delete this event
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
										handleDeleteEvent(item.eventId);
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
	);
};

export default EventCard;
