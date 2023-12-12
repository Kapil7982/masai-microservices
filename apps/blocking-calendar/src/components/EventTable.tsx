import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Td,
	Text,
	Tr,
	useDisclosure,
} from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { CgMoreVerticalO } from "react-icons/cg";

import { getCurrentDateTime, isValidURL } from "../helper/helper";
import UpdateForm from "./UpdateForm";

interface EventTableProps {
	item: any;
	handleDeleteEvent: (eventId: string) => void;
	handleDetailsClick: (item: any) => void;
	handleUpdateEvent: (eventId: string, data: any) => void;
}
interface Event {
	eventId: string;
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

const EventTable = ({
	item,
	handleDeleteEvent,
	handleDetailsClick,
	handleUpdateEvent,

}: EventTableProps) => {
	console.log(item);
	interface TimeDisplayProps {
		time: Date;
	}
	interface DateDisplayProps {
		date: string;
	}

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

	const handleEditClick = (event: Event) => {
		const clickedEvent = { ...event };
		setSelectedEvent(clickedEvent);
		setEditModalIsOpen(true);
	};

	return (
		<Tr>
			<Td>{item.summary}</Td>
			<Td>
				{item.meetLink && item.meetLink.conferenceId ? (
					<>
						<a
							style={{ fontSize: "13px", color: "blue" }}
							href={`https://meet.google.com/${item.meetLink.conferenceId}`}
						>
							{item.meetLink.conferenceId}
						</a>
					</>
				) : (
					<>
						<a
							style={{ fontSize: "13px", color: "blue" }}
							href={item.location}
						>
							{item.location}
						</a>
					</>
				)}
			</Td>
			<Td>
				{isValidURL(item.location) ? (
					<a
						href={item.location}
						target="_blank"
						rel="noopener noreferrer"
					>
						Zoom
					</a>
				) : (
					<Text fontSize="sm" fontWeight="100" color="gray">
						{item.location}
					</Text>
				)}
			</Td>
			<Td>
				<Text fontSize="sm" fontWeight="100" color="gray">
					<DateDisplay date={item.start} />
				</Text>
			</Td>
			<Td>
				<Text fontSize="sm" fontWeight="100" color="gray">
					<TimeDisplay time={item.start} /> -{" "}
					<TimeDisplay time={item.end} />
				</Text>
			</Td>
			<Td>
				<Button
					colorScheme="purple"
					onClick={() => handleDetailsClick(item)}
				>
					<CgMoreVerticalO />
				</Button>
			</Td>
			<Td>
				<Button
					colorScheme="green"
					onClick={() => handleEditClick(item)}
				>
					<FaEdit />
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
			</Td>
			<Td>
				<Button
					colorScheme="red"
					onClick={() => {
						onOpen();
						setSelectedEvent(item);
					}}
				>
					<MdDelete />
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
							<Button variant="ghost" mr={3} onClick={onClose}>
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
			</Td>
		</Tr>
	);
};

export default EventTable;
