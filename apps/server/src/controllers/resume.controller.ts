import { Response } from 'express';
import { sendSuccess, sendError } from '../utils/apiResponse';
import * as resumeService from '../services/resume.service';
import type { AuthenticatedRequest } from '../middleware/auth';

export async function uploadResume(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.userId) {
      sendError(res, 'Not authenticated', 'UNAUTHORIZED', 401);
      return;
    }

    const file = req.file;
    if (!file) {
      sendError(res, 'No file uploaded', 'NO_FILE', 400);
      return;
    }

    if (file.mimetype !== 'application/pdf') {
      sendError(res, 'Only PDF files are accepted', 'INVALID_FILE_TYPE', 400);
      return;
    }

    const result = await resumeService.processResume(
      req.userId,
      file.buffer,
      file.originalname
    );

    sendSuccess(res, result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Resume upload failed';
    sendError(res, message, 'RESUME_UPLOAD_FAILED', 500);
  }
}
