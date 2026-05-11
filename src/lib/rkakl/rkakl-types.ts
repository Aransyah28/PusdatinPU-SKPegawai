export interface RkaklDocument {
  id: string;
  title: string;
  year: number;
  description: string | null;
  fileUrl: string;
  fileName: string;
  fileSize: number | null;
  uploadedBy: string | null;
  createdAt: Date;
}
