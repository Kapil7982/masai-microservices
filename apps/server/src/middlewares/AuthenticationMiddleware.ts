// Import necessary modules and types from Express
import AuthController from "../controllers/auth.controller";
import { Request, Response, NextFunction } from "express";

// Class definition for AuthenticationMiddleware
export class AuthenticationMiddleware {

	// Middleware function to check if the user is authenticated
	public static isAuthenticated(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		// Check if tokens are present in the local storage
		if (req.headers['access_token']=="" && req.headers['refresh_token']==""||
		req.headers['access_token']==undefined && req.headers['refresh_token']==undefined ) {
			// If token is dameged, return an unauthorized status	
			return res.status(401).json({ message: "Unauthorized"});
		}
		

		// If tokens are present, continue to the next middleware or route handler
		next();
	}
}