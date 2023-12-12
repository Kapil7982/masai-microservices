import React, { useState, useEffect } from "react";
import axios from "axios";
import {
	useDisclosure,
	Box,
	Text,
	Button,
	Spinner,
	Table,
	Tr,
	Th,
	Tbody,
	Thead,
	useBreakpointValue,
	Heading,
} from "@chakra-ui/react";

import DetailsModal from "./DetailsModal";
import EventTableRow from "./EventTable";
import { useCustomToast } from "../helper/customHook";
import EventCard from "./EventCard";

const itemsPerPage = 4;

const Dashboard = (): JSX.Element => {
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
	const { onOpen, onClose } = useDisclosure();
	const [editModalIsOpen, setEditModalIsOpen] = useState(false);
	const showToast = useCustomToast();
	const responsiveTable = useBreakpointValue({ base: false, sm: true });
	const [selectedEventDetails, setSelectedEventDetails] =
		useState<Event | null>(null);

	const openEditModal = () => setEditModalIsOpen(true);
	const closeEditModal = () => setEditModalIsOpen(false);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const maxPages = Math.ceil(events.length / itemsPerPage);

	const isAtFirstPage = currentPage === 1;
	const isAtLastPage = currentPage === maxPages;

	const paginatedEvents = events.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage,
	);

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

	useEffect(() => {
		// we Replace 'example@gmail.com' with the desired user email in the backend
		const userEmail = "officialsiddharthbisht@gmail.com";
		setLoading(true);
		// Make a GET request to the backend API to fetch events
		fetch(`http://localhost:8080/event/list-events/${userEmail}`)
			.then((response) => response.json())
			.then((data) => {
				setLoading(false);
				setEvents(data || []); // Ensure that data.items is defined, otherwise use an empty array
			})
			.catch((error) => console.error("Error fetching events:", error));
	}, []);

	const handleUpdateEvent = async (eventId: string, updatedData: any) => {
		setEditModalIsOpen(true);
		try {
			const startDateTimeISO = new Date(updatedData.startDateTime);
			const endDateTimeISO = new Date(updatedData.endDateTime);
			const linesArray = updatedData.attendees.split("\n");
			const arrayOfObjects = linesArray.map((line: string) => {
				const [email, content] = line.split(": ");
				return { email, input: content };
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
			events.forEach((element: Event, index) => {
				console.log("element", 11, updatedData);
				if (element.eventId == eventId) {
					element.summary = updatedData.summary;
					element.description = updatedData.description;
					element.startDateTime = startDateTimeISO;
					element.endDateTime = endDateTimeISO;
					element.location = updatedData.location;
					element.attendees = arrayOfObjects;
				}
			});
			setEvents([...events]);
			showToast("Event updated successfully", "success");
			closeEditModal();
		} catch (error: any) {
			console.error("Error creating event:", error.message);
			showToast("Error updating event", "error");
		}
	};

	const handleDetailsClick = (event: Event) => {
		setSelectedEventDetails(event);
		onOpen(); // Open the modal
	};

	const handleDeleteEvent = (event_ID: string) => {
		fetch(`http://localhost:8080/event/delete-event/${event_ID}`)
			.then((response) => {
				setEvents(
					events.filter((element) => element.eventId !== event_ID),
				);
				showToast("Event Deleted successfully", "success");
				onClose();
			})
			.catch((error) => {
				showToast("Event Delete Error ", "error");
			});
	};

	return (
		<>
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
			<>
			  {paginatedEvents.length === 0 ? (
				// <h1>No events</h1>
				<Heading color={"gray.400"} mt={"10rem"}>No Scheduled events for you</Heading>
			  ) : (
				<>
				  {responsiveTable ? (
					<Table
					  variant="simple"
					  size={responsiveTable ? "sm" : undefined}
					>
					  <Thead>
						<Tr>
						  <Th>Summary</Th>
						  <Th>Meet Link</Th>
						  <Th>Location</Th>
						  <Th>Date</Th>
						  <Th>Time</Th>
						  <Th>Details</Th>
						  <Th>Edit</Th>
						  <Th>Delete</Th>
						</Tr>
					  </Thead>
					  <Tbody>
						{paginatedEvents.map((item: Event) => (
						  <EventTableRow
							key={item.eventId}
							item={item}
							handleDetailsClick={handleDetailsClick}
							handleDeleteEvent={handleDeleteEvent}
							handleUpdateEvent={handleUpdateEvent}
						  />
						))}
					  </Tbody>
					</Table>
				  ) : (
					paginatedEvents.map((item: Event, index) => (
					  <EventCard
						key={item.eventId}
						item={item}
						handleDeleteEvent={handleDeleteEvent}
						handleUpdateEvent={handleUpdateEvent}
						index={index}
						events={events}
					  />
					))
				  )}
  
				  {selectedEventDetails && (
					<DetailsModal
					  isOpen={true}
					  onClose={() => setSelectedEventDetails(null)}
					  event={selectedEventDetails}
					/>
				  )}
  
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
					  colorScheme={
						isAtLastPage || maxPages === 0 ? "gray.400" : "purple"
					  }
					  onClick={handleNextPage}
					  disabled={isAtLastPage}
					  color={
						isAtLastPage || maxPages === 0 ? "gray.400" : "white"
					  }
					>
					  Next
					</Button>
				  </Box>
				</>
			  )}
			</>
		  )}
		</Box>
	  </>
	);
};

export default Dashboard;
