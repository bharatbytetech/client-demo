import type { Request, Response } from "express";
import * as documentService from "../services/document.service";
import { uploadFile } from "../services/upload.service";
import type { CreateDocumentInput, ListDocumentsQuery } from "../validators/document.validator";

function handleDocumentError(err: unknown, res: Response): void {
  if (
    err instanceof documentService.DocumentNotFoundError ||
    err instanceof documentService.RelatedRecordNotFoundError
  ) {
    res.status(404).json({ message: err.message });
    return;
  }
  throw err;
}

export async function listDocumentsHandler(_req: Request, res: Response): Promise<void> {
  const query = res.locals.query as ListDocumentsQuery;
  const documents = await documentService.listDocuments(query);
  res.status(200).json({ documents });
}

export async function createDocumentHandler(req: Request, res: Response): Promise<void> {
  const input = req.body as CreateDocumentInput;
  const file = req.file as Express.Multer.File | undefined;

  if (!file) {
    res.status(400).json({ message: "No file provided" });
    return;
  }

  try {
    const uploaded = await uploadFile(file);
    const document = await documentService.createDocument(
      input,
      uploaded.url,
      (req.user as NonNullable<Request["user"]>).id
    );
    res.status(201).json({ document });
  } catch (err) {
    handleDocumentError(err, res);
  }
}

export async function deleteDocumentHandler(req: Request, res: Response): Promise<void> {
  try {
    await documentService.deleteDocument(req.params.id as string);
    res.status(204).send();
  } catch (err) {
    handleDocumentError(err, res);
  }
}
