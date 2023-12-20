// Import necessary modules and libraries
import { google } from "googleapis";
import OpenBrowserUtil from "../utils/OpenBrowserUtil";
import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import "../configs/passport";

// Load environment variables from a .env.development.local file
dotenv.config();

// Import configuration settings
import env from "../configs/env";
import { token } from "../interfaces/token";

// Extend the Session interface to include a 'tokens' property
declare module "express-session" {
	interface Session {
		tokens: token;
	}
}

// Class definition for AuthController
export class AuthController {
	// Static properties for user email and tokens
	public static userEmail: string;

	// Create an OAuth2Client using Google API credentials
	private static oAuth2Client = new google.auth.OAuth2(
		process.env.CLIENT_ID || "",
		process.env.CLIENT_SECRET || "",
		process.env.REDIRECT_URL || ""
	);

	// Create an OAuth2 instance for Google OAuth2 API
	private static oauth2 = google.oauth2({
		auth: AuthController.oAuth2Client,
		version: "v2",
	});

	public static tempToken: token;

	// Handle the callback after Google has authorized the user
	public static async handleOAuthCallback(req: Request, res: Response) {
		// Extract authorization code from the URL
		const { code: urlCode } = req.query;
		try {
			// Check if authorization code is present in the URL
			if (!urlCode) throw new Error("Authorization code not found in the URL.");

			// Extract authorization code from the query parameters
			const code: string = req.query.code as string;
			// console.log("Authorization code", code);

			// Exchange authorization code for tokens
			const { tokens }: any = await AuthController.oAuth2Client.getToken(code);
			// console.log("Token", tokens);

			// Set OAuth2Client credentials and get user information
			AuthController.oAuth2Client.setCredentials(tokens);
			const userInfoResponse = await AuthController.oauth2.userinfo.get();
			AuthController.userEmail = userInfoResponse.data.email || "";

			// Store tokens in the session for future use
			req.session.tokens = tokens;
			AuthController.tempToken=tokens
			
			// Redirect to the main page or any other route
			res.redirect("https://masai-blocking-calendar.netlify.app");
		} catch (error) {
			console.error("Error exchanging code for tokens:", error);
			res.status(500).send("Internal Server Error");
		}
	}

	public static getTempToken(req: Request, res: Response) {
		console.log("two =>", AuthController.tempToken)

		res.status(200).send(AuthController.tempToken);
		AuthController.tempToken={
			"access_token" : ``,
				"expiry_date" : +``,
				"id_token" : ``,
				"refresh_token" : ``,
				"scope" : ``,
				"token_type" : ``
		};
		console.log("two =>", AuthController.tempToken)
	
	}

	public static setTempToken(req: Request, res: Response) {
		
		AuthController.tempToken={
			"access_token" : ``,
				"expiry_date" : +``,
				"id_token" : ``,
				"refresh_token" : ``,
				"scope" : ``,
				"token_type" : ``
		};
		console.log("three =>", AuthController.tempToken)
		res.status(200)
	}



	// Initiate the authentication process by redirecting to Google OAuth2 URL
	public static authenticateUser(req: Request, res: Response) {

		// Generate authentication URL with required scopes
		const authUrl = AuthController.oAuth2Client.generateAuthUrl({
			access_type: "offline",
			scope: [
				"https://www.googleapis.com/auth/calendar",
				"https://www.googleapis.com/auth/userinfo.email",
			],
			client_id: process.env.CLIENT_ID,
			redirect_uri: process.env.REDIRECT_URL,
		});

		// Open the browser for authentication
		OpenBrowserUtil.open(authUrl);

		// Redirect to the authentication URL
		res.redirect(authUrl);
	}

	public login = async (req: Request, res: Response, next: NextFunction) => {
		passport.authenticate("local", function (err, user) {
			if (err || !user) {
				return res.status(401).json({
					message: err,
				});
			}
			req.logIn(user, function (err) {
				if (err) {
					return next(err);
				}

				return res.status(200).json({
					message: "Sign in successful!",
					error: false,
					user: req.user,
				});
			});
		})(req, res, next);
	};

	public signout = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		req.logout(function (err) {
			if (err) return next(err);
			res.status(200).clearCookie(env.AUTH_COOKIE_NAME, {
				domain: env.COOKIE_DOMAIN,
			});
			req.session.destroy(function (err) {
				if (err) return next(err);
				return res
					.status(200)
					.send({message: "Logged out successfully", error: false});
			});
		});
	};
}

export default AuthController;
