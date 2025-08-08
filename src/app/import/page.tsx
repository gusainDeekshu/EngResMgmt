// src/app/admin/import/page.tsx
'use client'; 

import { useState, ChangeEvent, FormEvent, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Upload, File, X, CheckCircle, AlertCircle, AlertTriangle, Eye } from 'lucide-react';
import * as XLSX from 'xlsx';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface IImportResult {
  email: string;
  status: 'success' | 'skipped' | 'failed';
  reason: string;
}

// ADDED: paymentDate to the preview interface
interface IPreviewData {
  fullName: string;
  email: string;
  phoneNumber: string;
  amountPaid: number;
  paymentDate: string; // <-- ADDED
  paymentStatus: string;
  fulfillmentStatus: string;
  paymentMethod: string;
  razorpayPaymentId?: string;
  gstNumber?: string;
}

export default function ImportUsersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [results, setResults] = useState<IImportResult[]>([]);
  const [finalMessage, setFinalMessage] = useState<string>('');
  const [previewData, setPreviewData] = useState<IPreviewData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(selectedFile.type)) {
        toast.error('Invalid File Type', { description: 'Please upload an .xlsx or .xls file.' });
        return;
      }
      
      setFile(selectedFile);
      setResults([]);
      setFinalMessage('');

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = event.target?.result;
          const workbook = XLSX.read(data, { type: 'binary', cellDates: true }); // Use cellDates for better parsing
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          
          // CHANGED: Updated header mapping to include paymentDate
          const json: IPreviewData[] = XLSX.utils.sheet_to_json(worksheet, {
            header: [
              'fullName', 'email', 'phoneNumber', 'amountPaid', 
              'paymentDate', 'paymentStatus', 'fulfillmentStatus', 'paymentMethod', 
              'razorpayPaymentId', 'gstNumber'
            ],
            range: 1 // Skip the header row
          });

          // Format the date for display
          const formattedPreview = json.map(row => ({
            ...row,
            paymentDate: row.paymentDate ? new Date(row.paymentDate).toLocaleDateString('en-CA') : 'N/A' // YYYY-MM-DD format
          }));
          setPreviewData(formattedPreview);

        } catch (err) {
            console.error("Error parsing file:", err);
            toast.error("Failed to read file", { description: "The selected file might be corrupted."});
            setPreviewData([]);
        }
      };
      reader.readAsBinaryString(selectedFile);
    }
  };

  const clearSelection = () => {
    setFile(null);
    setPreviewData([]);
    setResults([]);
    setFinalMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast.warning('No file selected', { description: 'Please choose a file to import.' });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    const NEXT_JS_API_ENDPOINT = '/api/import';

    try {
      const response = await axios.post(NEXT_JS_API_ENDPOINT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total ?? 0;
          const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
          setUploadProgress(percentCompleted);
        },
      });

      toast.success('Import Complete', { description: response.data.message || 'The import process has finished.' });
      setResults(response.data.results || []);
      setFinalMessage(response.data.message);
      setPreviewData([]);

    } catch (error: any) {
      console.error('File upload failed:', error);
      const errorMessage = error.response?.data?.message || 'An unknown error occurred.';
      toast.error('Upload Failed', { description: errorMessage });
      setFinalMessage(`Error: ${errorMessage}`);
    } finally {
      setIsUploading(false);
    }
  };
  
  const StatusIcon = ({ status }: { status: IImportResult['status'] }) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'skipped': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'failed': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

  return (
    <main className="container mx-auto p-4 md:p-8 space-y-8">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Upload className="h-6 w-6" />
            Bulk User & Order Importer
          </CardTitle>
          {/* CHANGED: Updated description with new column order */}
          <CardDescription>
            Step 1: Upload Excel file. Columns must be in this exact order: <strong>fullName, email, phoneNumber, amountPaid, paymentDate, paymentStatus, fulfillmentStatus, paymentMethod, razorpayPaymentId (opt), gstNumber (opt)</strong>.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleUpload}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Excel Import File</Label>
              <Input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <div
                className="flex items-center justify-center w-full p-6 border-2 border-dashed rounded-md cursor-pointer transition-colors hover:border-primary"
                onClick={() => !isUploading && fileInputRef.current?.click()}
              >
                {file ? (
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <File className="h-8 w-8 text-primary" />
                    <span className="truncate max-w-[200px] md:max-w-md">{file.name}</span>
                    <Button
                      type="button" variant="ghost" size="icon"
                      className="text-muted-foreground hover:text-destructive h-8 w-8"
                      onClick={(e) => { e.stopPropagation(); clearSelection(); }}
                      disabled={isUploading}
                    ><X className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <Upload className="mx-auto h-12 w-12" />
                    <p className="mt-2 text-sm">Click to browse or drag and drop a file</p>
                  </div>
                )}
              </div>
            </div>
            {isUploading && (
              <div className="space-y-2">
                <Label>Uploading...</Label>
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground text-center">{uploadProgress}%</p>
              </div>
            )}
          </CardContent>

          <CardFooter className="border-t pt-6">
            <Button type="submit" disabled={isUploading || !file || previewData.length === 0} className="w-full md:w-auto">
              {isUploading ? 'Processing...' : 'Confirm and Import Data'}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {previewData.length > 0 && (
        <Card className="max-w-6xl mx-auto">
            <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <Eye className="h-6 w-6" />
                    Data Preview
                </CardTitle>
                <CardDescription>
                    Step 2: Review the parsed data. If it looks correct, click {'"'}Confirm and Import Data{'"'} above.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative max-h-[400px] overflow-auto border">
                    <Table>
                        {/* CHANGED: Updated table headers for preview */}
                        <TableHeader className="sticky top-0 bg-background">
                            <TableRow>
                                <TableHead>Full Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Payment Date</TableHead>
                                <TableHead>Amount Paid</TableHead>
                                <TableHead>Payment Status</TableHead>
                                <TableHead>Fulfillment</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {previewData.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.fullName}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.paymentDate}</TableCell>
                                    <TableCell>{row.amountPaid}</TableCell>
                                    <TableCell>{row.paymentStatus}</TableCell>
                                    <TableCell>{row.fulfillmentStatus}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      )}

{results.length > 0 && (
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle>Import Report</CardTitle>
            <CardDescription>{finalMessage}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell><StatusIcon status={result.status} /></TableCell>
                    <TableCell className="font-mono">{result.email}</TableCell>
                    <TableCell>
                      <span className={`font-semibold ${
                        result.status === 'success' ? 'text-green-600' :
                        result.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {result.status.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell>{result.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}   </main>
  );
}
    