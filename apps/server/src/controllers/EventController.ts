// Import necessary modules and services
import { eventData } from "@interfaces/eventData";
import {Request, Response} from "express";
import {CalendarService} from "../services/CalendarService";
import {AuthController} from "./auth.controller";

// Class definition for EventController
export class EventController {

	// Handle scheduling a new event
	public static async scheduleEvent(req: Request, res: Response) {
		try {
			const CalendarToken={
				"access_token" : `${req.headers['access_token']}`,
				"refresh_token" : `${req.headers['refresh_token']}`,
				"scope" : `${req.headers['scope']}`,
				"token_type" : `${req.headers['token_type']}`,
				"id_token" : `${req.headers['id_token']}`,
				"expiry_date" : +`${req.headers['expiry_date']}`,	
				}
			// Retrieve event data from the request body
			const eventData = req.body;

			// Ensure the user is authenticated
			const tokens = req.session.tokens;

			// if (!AuthController.tokenn) throw new Error("User not authenticated. Please log in first..!!");
			
			if(eventData.summary=="" ||eventData.location=="" || eventData.attendees.length==0){
				throw new Error("summary or location or attendees is empty"); 	
				}
			// Insert the event into the calendar
			
			const response = await CalendarService.insertEvent(eventData,CalendarToken);

			// Send success response
			res.status(201).send({
				msg: "Event created successfully",
			});
		} catch (error: any) {
			console.error("Error creating event:", error.message);
			res.status(500).send({msg:"Internal Server Error"});
		}
	}

	// Handle listing events for the authenticated user
	public static async listEvent(req: Request, res: Response) {
		try {
			
		    const CalendarToken={
		    "access_token" : `${req.headers['access_token']}`,
		    "expiry_date" : +`${req.headers['expiry_date']}`,
		    "id_token" : `${req.headers['id_token']}`,
		    "refresh_token" : `${req.headers['refresh_token']}`,
		    "scope" : `${req.headers['scope']}`,
		    "token_type" : `${req.headers['token_type']}`		
		    }
			// List events for the authenticated user		
			const response = await CalendarService.listEvents(
				AuthController.userEmail,CalendarToken
			);

			// Send the list of events as a response
			res.send(response);
			
		} catch (error: any) {
			console.error("Error listing event:", error.message);
			res.status(500).send({msg:"Internal Server Error"});
		}
	}

	// Handle updating an existing event
	public static async updateEvent(req: Request, res: Response) {
		try {
			const CalendarToken={
				"access_token" : `${req.headers['access_token']}`,
				"expiry_date" : +`${req.headers['expiry_date']}`,
				"id_token" : `${req.headers['id_token']}`,
				"refresh_token" : `${req.headers['refresh_token']}`,
				"scope" : `${req.headers['scope']}`,
				"token_type" : `${req.headers['token_type']}`		
				}
			// Retrieve event ID from request parameters
			const eventId:String = req.params.eventId;

			// Retrieve updated event data from the request body
			const updatedEventData:eventData = req.body;
			console.log(updatedEventData);

			// Ensure the user is authenticated
			const tokens = req.session.tokens;
			// if (!AuthController.tokenn) throw new Error("User not authenticated. Please log in first..!!");
			if(updatedEventData.summary=="" ||updatedEventData.location=="" || updatedEventData.attendees.length==0){
				throw new Error("summary or location or attendees is empty"); 	
				}
			// Update the event in the calendar
			const response = await CalendarService.updateEvent(
				eventId,
				updatedEventData,
				CalendarToken
			);


			// Send success response with updated event details
			res.send({
				msg: "Event updated successfully",
				updatedEvent: response,
			});
		} catch (error: any) {
			console.error("Error updating event:", error.message);
			res.status(500).send({msg:"Internal Server Error"});
		}
	}

	// Handle deleting an existing event
	public static async deleteEvent(req: Request, res: Response) {
		try {
			const CalendarToken={
				"access_token" : `${req.headers['access_token']}`,
				"expiry_date" : +`${req.headers['expiry_date']}`,
				"id_token" : `${req.headers['id_token']}`,
				"refresh_token" : `${req.headers['refresh_token']}`,
				"scope" : `${req.headers['scope']}`,
				"token_type" : `${req.headers['token_type']}`		
				}
			// Retrieve event ID from request parameters
			const eventId:String = req.params.eventId;


			// Delete the event from the calendar
			const response = await CalendarService.deleteEvent(eventId,CalendarToken);


			// Send success response
			res.send({
				msg: "Event deleted successfully",
			});
		} catch (error: any) {
			console.error("Error deleting event:", error.message);
			res.status(500).send({msg:"Internal Server Error"});
		}
	}
}