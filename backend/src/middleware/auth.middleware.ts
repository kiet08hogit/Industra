import { Request, Response, NextFunction } from "express";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import pool from "../db/pool";

declare global {
    namespace Express {
        interface Request {
            auth?: any; 
            user?: any; 
        }
    }
}

export const requireAuth: any[] = [
    ClerkExpressWithAuth(),

    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.auth || !req.auth.userId) {
                res.status(401).json({ error: "Unauthenticated" });
                return;
            }

            const clerkId = req.auth.userId;

            const result = await pool.query("SELECT * FROM users WHERE clerk_id = $1", [clerkId]);

            if (result.rows.length > 0) {
                req.user = result.rows[0];
                next();
            } else {
              
                const emailPlaceholder = `${clerkId}@clerk.user`;
                const newUser = await pool.query(
                    "INSERT INTO users (clerk_id, email) VALUES ($1, $2) RETURNING *",
                    [clerkId, emailPlaceholder]
                );

                req.user = newUser.rows[0];
                next();
            }
        } catch (error) {
            console.error("Auth Middleware Error:", error);
            res.status(500).json({ error: "Internal Server Error during Auth" });
        }
    }
];
