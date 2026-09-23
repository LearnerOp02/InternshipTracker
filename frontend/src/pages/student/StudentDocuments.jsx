/* eslint-disable react-hooks/set-state-in-effect */
import {
  useEffect,
  useState,
} from "react";

import {
  getMyDocuments,
  uploadDocument,
} from "../../services/documentService";

const StudentDocuments = () => {
  const [documents, setDocuments] =
    useState([]);

  const [documentType, setDocumentType] =
    useState("");

  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");


  // ==========================================
  // LOAD DOCUMENTS
  // ==========================================

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getMyDocuments();

      const documentList =
        data.documents ||
        data.data ||
        data ||
        [];

      setDocuments(
        Array.isArray(documentList)
          ? documentList
          : []
      );
    } catch (error) {
      console.error(
        "Load documents error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load documents"
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadDocuments();
  }, []);


  // ==========================================
  // HANDLE FILE
  // ==========================================

  const handleFileChange = (event) => {
    const selectedFile =
      event.target.files[0];

    setFile(selectedFile || null);
  };


  // ==========================================
  // UPLOAD DOCUMENT
  // ==========================================

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!documentType) {
      setError(
        "Please select a document type."
      );
      return;
    }

    if (!file) {
      setError(
        "Please select a file."
      );
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData =
        new FormData();

      formData.append(
        "documentType",
        documentType
      );

      formData.append(
        "file",
        file
      );

      await uploadDocument(
        formData
      );

      setSuccess(
        "Document uploaded successfully."
      );

      setDocumentType("");
      setFile(null);

      const input =
        document.getElementById(
          "document-file"
        );

      if (input) {
        input.value = "";
      }

      await loadDocuments();

    } catch (error) {
      console.error(
        "Upload document error:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to upload document"
      );
    } finally {
      setUploading(false);
    }
  };


  // ==========================================
  // STATISTICS
  // ==========================================

  const totalDocuments =
    documents.length;

  const pendingDocuments =
    documents.filter(
      (document) =>
        document.status === "pending"
    ).length;

  const verifiedDocuments =
    documents.filter(
      (document) =>
        document.status === "verified"
    ).length;

  const rejectedDocuments =
    documents.filter(
      (document) =>
        document.status === "rejected"
    ).length;


  return (
    <div>

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-slate-900">
          Documents
        </h1>

        <p className="mt-1 text-slate-500">
          Upload and manage your
          internship documents.
        </p>

      </div>


      {/* ERROR */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}


      {/* SUCCESS */}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}


      {/* STATISTICS */}

      {!loading && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <DocumentStatCard
            title="Total"
            value={totalDocuments}
          />

          <DocumentStatCard
            title="Pending"
            value={pendingDocuments}
          />

          <DocumentStatCard
            title="Verified"
            value={verifiedDocuments}
          />

          <DocumentStatCard
            title="Rejected"
            value={rejectedDocuments}
          />

        </div>
      )}


      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">


        {/* ================================= */}
        {/* UPLOAD FORM */}
        {/* ================================= */}

        <div>

          <form
            onSubmit={handleUpload}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >

            <h2 className="text-xl font-semibold text-slate-900">
              Upload Document
            </h2>


            <div className="mt-5">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Document Type
              </label>

              <select
                value={documentType}
                onChange={(event) =>
                  setDocumentType(
                    event.target.value
                  )
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              >

                <option value="">
                  Select document
                </option>

                <option value="resume">
                  Resume
                </option>

                <option value="offer_letter">
                  Offer Letter
                </option>

                <option value="joining_letter">
                  Joining Letter
                </option>

                <option value="completion_certificate">
                  Completion Certificate
                </option>

                <option value="internship_certificate">
                  Internship Certificate
                </option>

                <option value="other">
                  Other
                </option>

              </select>

            </div>


            <div className="mt-4">

              <label
                htmlFor="document-file"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Choose File
              </label>

              <input
                id="document-file"
                type="file"
                onChange={
                  handleFileChange
                }
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="block w-full rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-600"
                required
              />

            </div>


            {file && (
              <div className="mt-4 rounded-lg bg-slate-50 p-3">

                <p className="text-xs text-slate-500">
                  Selected File
                </p>

                <p className="mt-1 break-all text-sm font-medium text-slate-800">
                  {file.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {formatFileSize(
                    file.size
                  )}
                </p>

              </div>
            )}


            <button
              type="submit"
              disabled={uploading}
              className="mt-5 w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading
                ? "Uploading..."
                : "Upload Document"}
            </button>

          </form>

        </div>


        {/* ================================= */}
        {/* DOCUMENT LIST */}
        {/* ================================= */}

        <div>

          <div className="mb-4">

            <h2 className="text-xl font-semibold text-slate-900">
              My Documents
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View uploaded documents and
              their verification status.
            </p>

          </div>


          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              Loading documents...
            </div>
          ) : documents.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <h3 className="font-semibold text-slate-900">
                No documents uploaded
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Upload your first document
                using the form.
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {documents.map(
                (document) => (
                  <DocumentCard
                    key={document._id}
                    document={
                      document
                    }
                  />
                )
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};


// ==========================================
// DOCUMENT CARD
// ==========================================

const DocumentCard = ({
  document,
}) => {
  const status =
    document.status ||
    "pending";

  const fileUrl =
    document.fileUrl ||
    document.filePath ||
    document.url;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">

        <div>

          <div className="flex flex-wrap items-center gap-3">

            <h3 className="text-lg font-semibold capitalize text-slate-900">
              {formatDocumentType(
                document.documentType ||
                  document.type
              )}
            </h3>

            <StatusBadge
              status={status}
            />

          </div>


          <p className="mt-2 text-sm text-slate-500">
            {document.fileName ||
              document.originalName ||
              "Uploaded document"}
          </p>


          <p className="mt-1 text-xs text-slate-400">
            Uploaded:{" "}
            {formatDateTime(
              document.createdAt
            )}
          </p>

        </div>


        {fileUrl && (
          <a
            href={fileUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-center text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            View Document
          </a>
        )}

      </div>


      {status === "rejected" && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4">

          <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
            Rejection Reason
          </p>

          <p className="mt-2 text-sm text-red-700">
            {document.rejectionReason ||
              document.remarks ||
              "Document was rejected by the Placement Cell."}
          </p>

        </div>
      )}


      {status === "verified" && (
        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">

          <p className="text-sm text-green-700">
            This document has been
            verified by the Placement Cell.
          </p>

        </div>
      )}

    </div>
  );
};


// ==========================================
// STATUS BADGE
// ==========================================

const StatusBadge = ({
  status,
}) => {
  const styles = {
    pending:
      "bg-yellow-50 text-yellow-700",

    verified:
      "bg-green-50 text-green-700",

    rejected:
      "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
        styles[status] ||
        "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
};


// ==========================================
// STAT CARD
// ==========================================

const DocumentStatCard = ({
  title,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-900">
        {value}
      </p>

    </div>
  );
};


// ==========================================
// HELPERS
// ==========================================

const formatDocumentType = (
  type
) => {
  if (!type) {
    return "Document";
  }

  return type
    .replaceAll("_", " ");
};


const formatDateTime = (
  date
) => {
  if (!date) {
    return "N/A";
  }

  return new Date(
    date
  ).toLocaleString();
};


const formatFileSize = (
  bytes
) => {
  if (!bytes) {
    return "0 KB";
  }

  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    (1024 * 1024)
  ).toFixed(1)} MB`;
};


export default StudentDocuments;