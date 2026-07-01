import type { Request, Response } from "express";
import * as searchService from "../services/search.service";
import type { SearchQuery } from "../validators/search.validator";

export async function searchHandler(_req: Request, res: Response): Promise<void> {
  const query = res.locals.query as SearchQuery;
  const results = await searchService.search(query);
  res.status(200).json(results);
}
