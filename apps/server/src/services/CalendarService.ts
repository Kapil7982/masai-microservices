// Import necessary modules and types
import { google } from "googleapis";
import dayjs from 'dayjs';
import { v4 as uuid } from 'uuid';
import  {eventData}  from "@interfaces/eventData";
import { Myattendees } from "@interfaces/attendees";
import { AuthController  } from "../controllers/auth.controller";
import { token } from "@interfaces/token";
// Class definition for CalendarService
export class CalendarService {
    // Static property for interacting with the Google Calendar API
    private static calendar = google.calendar({
        version: "v3",
    });
    // Method to insert a new event into the user's calendar
    public static async insertEvent(eventData: eventData,token :token) {
        // Create an OAuth2Client instance for handling Google OAuth2
        const oAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        );
        // Set OAuth2Client credentials using the tokens from the authenticated user
        oAuth2Client.setCredentials(token);
        // Convert event start and end times to ISO format
        const startDateTime = dayjs(eventData.startDateTime).toISOString();
        const endDateTime = dayjs(eventData.endDateTime).toISOString();
        // Insert the event into the user's calendar
        const isLink = (location) => {
            // Define a regex pattern for detecting links (URLs)
            const linkRegex = /^(http|https):\/\/[^ "]+$/;
            // Check if the location matches the link pattern
            return linkRegex.test(location);
          };
          const response = await CalendarService.calendar.events.insert({
            calendarId: "primary",
            auth: oAuth2Client,
            conferenceDataVersion: 1,
            sendNotifications: true,
            requestBody: {
              summary: eventData.summary,
              description: eventData.description,
              start: {
                dateTime: startDateTime,
                timeZone: "Asia/Kolkata",
              },
              end: {
                dateTime: endDateTime,
                timeZone: "Asia/Kolkata",
              },
              attendees: eventData.attendees,
              ...(isLink(eventData.location)
                ? {
                    location: eventData.location, // Remove the location field if it's a link
                  }
                : {
                    location: eventData.location,
                    conferenceData: { createRequest: { requestId: uuid() } },
                  }),
            },
          });
        // Return the data of the created event
        return response.data;
    }
    // Method to list upcoming events for the authenticated user
    public static async listEvents(userEmail: String, token :token) {
        // Create an OAuth2Client instance for handling Google OAuth2
        const oAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        );
        // Set OAuth2Client credentials using the tokens from the authenticated user
        oAuth2Client.setCredentials(token);
        try {
            // Retrieve upcoming events from the user's calendar
            const response = await CalendarService.calendar.events.list({
                calendarId: "primary",
                auth: oAuth2Client,
                timeMin: new Date().toISOString(),
                maxResults: 10,
                singleEvents: true,
                orderBy: "startTime",
            });
            // Process the response data to extract relevant event details
            const events = (await response).data.items || [];
            const eventDetails: {
                summary: String;
                description: String;
                start: Date;
                end: Date;
                attendees: Myattendees;
                meetLink: any;
                location: String;
                eventId: String;
            }[] = [];
            events.forEach((event: {
                start?: any,
                summary?: String ,
                description?: String,
                end?: any,
                attendees?: any,
                conferenceData?: any,
                location?: String,
                id?: String
            }) => {
                const start = event.start.dateTime || event.start.date;
                const eventObject = {
                    summary: event.summary || "",
                    description: event.description || "",
                    start,
                    end: event.end.dateTime || event.end.date,
                    attendees: event.attendees || [],
                    meetLink: event.conferenceData || "",
                    location: event.location || "",
                    eventId: event.id,
                };
                eventDetails.push(eventObject);
            });
            return eventDetails;
        } catch (error: any) {
            // Log and throw any errors that occur during the process
            console.error("Error fetching events:", error.message);
            throw error;
        }
    }
    // Method to update an existing event in the user's calendar
    public static async updateEvent(eventId, updatedEvent: eventData,token :token) {
        const isLink = (location) => {
            // Define a regex pattern for detecting links (URLs)
            const linkRegex = /^(http|https):\/\/[^ "]+$/;
            // Check if the location matches the link pattern
            return linkRegex.test(location);
          };
        // Create an OAuth2Client instance for handling Google OAuth2
        const oAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        );
        // Convert updated event start and end times to ISO format
        const startDateTime = dayjs(updatedEvent.startDateTime).toISOString();
        const endDateTime = dayjs(updatedEvent.endDateTime).toISOString();
        // Set OAuth2Client credentials using the tokens from the authenticated user
        oAuth2Client.setCredentials(token);
        // Update the specified event in the user's calendar
        const response = await CalendarService.calendar.events.update({
            auth: oAuth2Client,
            calendarId: "primary",
            eventId: eventId,
            conferenceDataVersion: 1,
            sendNotifications:true,
            requestBody: {
                summary: updatedEvent.summary,
                description: updatedEvent.description,
                location: updatedEvent.location,
                start: {
                    dateTime: startDateTime,
                    timeZone: "Asia/Kolkata",
                },
                end: {
                    dateTime: endDateTime,
                    timeZone: "Asia/Kolkata",
                },
                // conferenceData: {
                //  createRequest: {
                //      requestId: uuid(),
                //  },
                // },
                attendees: updatedEvent.attendees,
                ...(isLink(updatedEvent.location)
                ? {
                    location: updatedEvent.location, // Remove the location field if it's a link
                  }
                : {
                    location: updatedEvent.location,
                    conferenceData: { createRequest: { requestId: uuid() } },
                  }),
            },
        });
        // Log the updated event data and return it
        return response.data;
    }
    // Method to delete an existing event from the user's calendar
    public static async deleteEvent(eventId,token :token) {
        // Create an OAuth2Client instance for handling Google OAuth2
        const oAuth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URL
        );
        // Set OAuth2Client credentials using the tokens from the authenticated user
        oAuth2Client.setCredentials(token);
        // Retrieve the details of the event before deleting it
        const response1 = await CalendarService.calendar.events.get({
            auth: oAuth2Client,
            calendarId: "primary",
            eventId: eventId,
        });
        // Delete the specified event from the user's calendar
        const response = await CalendarService.calendar.events.delete({
            auth: oAuth2Client,
            calendarId: "primary",
            sendNotifications:true,
            eventId: eventId,
        });
        // Return the details of the deleted event
        return response1.data;
    }
}