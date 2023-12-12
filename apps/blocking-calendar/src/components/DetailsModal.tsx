// DetailsModal.tsx
import React, { useState } from "react";
import logo from "../google-meet.svg";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	ModalFooter,
	Text,
	Button,
	Box,
	Heading,
	List,
	ListItem,
	UnorderedList,
} from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { isValidURL } from "../helper/helper";

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

interface DetailsModalProps {
	isOpen: boolean;
	onClose: () => void;
	event: Event | null;
}

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

const DetailsModal: React.FC<DetailsModalProps> = ({
	isOpen,
	onClose,
	event,
}) => {
	console.log(event)
	return (
		<Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Event Details</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{event && (
						<>
							<Box className="detailsHead">
								<Box h={{ sm: "40px", md: "40px", lg: "40px" }}>
									<Heading size="md">{event.summary}</Heading>
								</Box>
							</Box>
							<Box display={"flex"} w={"100%"} gap={"3rem"}>
								<Box w={"100%"} maxW={"250px"}>
									<Box className="linkbox">
										{event.meetLink &&
										event.meetLink.conferenceId ? (
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
													href={`https://meet.google.com/${event.meetLink.conferenceId}`}
												>
													<Text>
														{
															event.meetLink
																.conferenceId
														}
													</Text>
												</a>
											</>
										) : (
											<Text></Text>
										)}
									</Box>

									{/* box for metting place */}

									<Box height={"25px"}>
										{isValidURL(event.location) ? (
											<a
												href={event.location}
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
												{event.location}
											</Text>
										)}
									</Box>

									<br />
									<Box className="timebox">
										<Heading size="md">
											<TimeDisplay time={event.start} />
										</Heading>
										<Heading size="md">
											{<FiArrowRight />}
										</Heading>
										<Heading size="md">
											<TimeDisplay time={event.end} />
										</Heading>
									</Box>
									<Box className="timebox" pb={"1rem"}>
										<Text
											fontSize="sm"
											fontWeight={"100"}
											color="gray"
										>
											<DateDisplay date={event.start} />
										</Text>
									</Box>
									<h5
										style={{
											textAlign: "start",
											fontSize: "14px",
											fontWeight: "700",
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
											{event.description}
										</Text>
									</Box>

									{/* Place for link */}

									{/* <br /> */}

									{/* <Box className="timebox">
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
											<ModalHeader>Edit Event</ModalHeader>
											<ModalCloseButton />
											<ModalBody>
												{selectedEvent && (
													<UpdateForm2
														getCurrentDateTime={
															getCurrentDateTime
														}
														eventData={selectedEvent}
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
											<ModalHeader>Delete Event</ModalHeader>
											<ModalCloseButton />
											<ModalBody>
												<Text>
													Are you sure, you want to delete
													this event
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
								</Box> */}
								</Box>
								<Box w={"50%"} className="attendeesBox">
									<h5
										style={{
											textAlign: "start",
											fontSize: "14px",
											fontWeight: "700",
										}}
									>
										Attendees :
									</h5>
									<Box
										className="dropdownBox"
										display={"flex"}
										justifyContent={"start"}
										maxHeight={{
											sm: "40px",
											md: "90px",
											lg: "255px",
										}}
										minHeight={{
											sm: "40px",
											md: "40px",
											lg: "250px",
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
											height={"250px"}
											pt={1}
											pl={1}
										>
											<List>
												<UnorderedList>
													{event.attendees.map(
														(
															email: any,
															emailIndex: number,
														) => (
															<ListItem
																key={emailIndex}
																style={{
																	fontSize:
																		"14px",
																}}
															>
																{email.email}
															</ListItem>
														),
													)}
												</UnorderedList>
											</List>
										</Text>
									</Box>
								</Box>
							</Box>
						</>
					)}
				</ModalBody>
				<ModalFooter>
					<Button variant="ghost" onClick={onClose}>
						Close
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default DetailsModal;
