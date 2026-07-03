import type { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service";

export async function getStatsHandler(_req: Request, res: Response): Promise<void> {
  const stats = await dashboardService.getStats();
  res.status(200).json({ stats });
}
