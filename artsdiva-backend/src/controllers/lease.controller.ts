import type { Request, Response } from "express";
import * as leaseService from "../services/lease.service";
import type { CreateLeaseInput, ListLeasesQuery } from "../validators/lease.validator";

function handleLeaseError(err: unknown, res: Response): void {
  if (
    err instanceof leaseService.LeaseNotFoundError ||
    err instanceof leaseService.ArtworkNotFoundForLeaseError ||
    err instanceof leaseService.ClientNotFoundForLeaseError
  ) {
    res.status(404).json({ message: err.message });
    return;
  }
  if (
    err instanceof leaseService.ArtworkAlreadyOnActiveLeaseError ||
    err instanceof leaseService.ArtworkNotAvailableForLeaseError
  ) {
    res.status(400).json({ message: err.message });
    return;
  }
  throw err;
}

export async function listLeasesHandler(_req: Request, res: Response): Promise<void> {
  const query = res.locals.query as ListLeasesQuery;
  const result = await leaseService.listLeases(query);
  res.status(200).json(result);
}

export async function getLeaseHandler(req: Request, res: Response): Promise<void> {
  try {
    const lease = await leaseService.getLeaseById(req.params.id as string);
    res.status(200).json({ lease });
  } catch (err) {
    handleLeaseError(err, res);
  }
}

export async function createLeaseHandler(req: Request, res: Response): Promise<void> {
  const input = req.body as CreateLeaseInput;
  try {
    const lease = await leaseService.createLease(input);
    res.status(201).json({ lease });
  } catch (err) {
    handleLeaseError(err, res);
  }
}

export async function completeLeaseHandler(req: Request, res: Response): Promise<void> {
  try {
    const lease = await leaseService.completeLease(req.params.id as string);
    res.status(200).json({ lease });
  } catch (err) {
    handleLeaseError(err, res);
  }
}

export async function cancelLeaseHandler(req: Request, res: Response): Promise<void> {
  try {
    const lease = await leaseService.cancelLease(req.params.id as string);
    res.status(200).json({ lease });
  } catch (err) {
    handleLeaseError(err, res);
  }
}
