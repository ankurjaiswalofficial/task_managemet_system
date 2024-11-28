import { NextApiRequest, NextApiResponse } from "next";
import { jwtVerify } from "jose";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

    res.status(200).json({ message: "Authenticated", user: decoded });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
}
