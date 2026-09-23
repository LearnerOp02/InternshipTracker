/* eslint-disable react-hooks/immutability */
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAllDocuments,
  verifyDocument,
  rejectDocument,
} from "../../services/placementService";


const PlacementDocuments = () => {
  const [
    documents,
    setDocuments,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [status, setStatus] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [processingId, setProcessingId] =
    useState(null);


  useEffect(() => {
    loadDocuments();
  }, []);


  const loadDocuments = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data =
        await getAllDocuments();

      const list =
        data.documents ||
        data.data ||
        data ||
        [];

      setDocuments(
        Array.isArray(list)
          ? list
          : []
      );
    } catch (error) {
      console.error(
        "Load documents error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to load documents"
      );
    } finally {
      setLoading(false);
    }
  };


  const filteredDocuments =
    useMemo(() => {
      return documents.filter(
        (document) => {
          const name =
            document.studentId
              ?.userId?.name ||
            "";

          const email =
            document.studentId
              ?.userId?.email ||
            "";

          const documentType =
            document.documentType ||
            document.type ||
            "";

          const searchValue =
            search
              .trim()
              .toLowerCase();

          const matchesSearch =
            !searchValue ||
            name
              .toLowerCase()
              .includes(searchValue) ||
            email
              .toLowerCase()
              .includes(searchValue) ||
            documentType
              .toLowerCase()
              .includes(searchValue);

          const matchesStatus =
            !status ||
            document.status === status;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      documents,
      search,
      status,
    ]);


  const handleVerify = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Verify this document?"
      );

    if (!confirmed) return;

    try {
      setProcessingId(id);
      setMessage("");

      await verifyDocument(id);

      setMessage(
        "Document verified successfully"
      );

      await loadDocuments();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to verify document"
      );
    } finally {
      setProcessingId(null);
    }
  };


  const handleReject = async (
    id
  ) => {
    const reason =
      window.prompt(
        "Enter rejection reason:"
      );

    if (!reason?.trim()) {
      return;
    }

    try {
      setProcessingId(id);
      setMessage("");

      await rejectDocument(
        id,
        reason.trim()
      );

      setMessage(
        "Document rejected successfully"
      );

      await loadDocuments();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to reject document"
      );
    } finally {
      setProcessingId(null);
    }
  };


  const getStatusClass = (
    documentStatus
  ) => {
    switch (documentStatus) {
      case "verified":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };


  if (loading) {
    return (
      <div className="p-6">
        Loading documents...
      </div>
    );
  }


  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Document Verification
        </h1>

        <p className="mt-2 text-gray-500">
          Review and verify documents
          uploaded by students.
        </p>

      </div>


      {/* MESSAGE */}
      {message && (
        <div
          className="
            mb-6
            rounded-lg
            border
            bg-blue-50
            p-4
            text-blue-700
          "
        >
          {message}
        </div>
      )}


      {/* STATS */}
      <div
        className="
          mb-6
          grid
          grid-cols-1
          gap-4
          md:grid-cols-4
        "
      >

        <div className="rounded-xl border bg-white p-5">
          <p className="text-gray-500">
            Total
          </p>

          <p className="mt-1 text-3xl font-bold">
            {documents.length}
          </p>
        </div>


        <div className="rounded-xl border bg-white p-5">
          <p className="text-gray-500">
            Pending
          </p>

          <p className="mt-1 text-3xl font-bold">
            {
              documents.filter(
                (item) =>
                  item.status ===
                  "pending"
              ).length
            }
          </p>
        </div>


        <div className="rounded-xl border bg-white p-5">
          <p className="text-gray-500">
            Verified
          </p>

          <p className="mt-1 text-3xl font-bold">
            {
              documents.filter(
                (item) =>
                  item.status ===
                  "verified"
              ).length
            }
          </p>
        </div>


        <div className="rounded-xl border bg-white p-5">
          <p className="text-gray-500">
            Rejected
          </p>

          <p className="mt-1 text-3xl font-bold">
            {
              documents.filter(
                (item) =>
                  item.status ===
                  "rejected"
              ).length
            }
          </p>
        </div>

      </div>


      {/* FILTERS */}
      <div
        className="
          mb-6
          grid
          grid-cols-1
          gap-4
          rounded-xl
          border
          bg-white
          p-5
          md:grid-cols-2
        "
      >

        <input
          type="text"
          placeholder="Search student or document type"
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            rounded-lg
            border
            px-4
            py-2.5
            outline-none
            focus:ring-2
            focus:ring-black
          "
        />


        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value
            )
          }
          className="
            rounded-lg
            border
            px-4
            py-2.5
            outline-none
          "
        >
          <option value="">
            All Statuses
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="verified">
            Verified
          </option>

          <option value="rejected">
            Rejected
          </option>

        </select>

      </div>


      {/* TABLE */}
      <div
        className="
          overflow-hidden
          rounded-xl
          border
          bg-white
        "
      >
        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead
              className="
                border-b
                bg-gray-50
              "
            >
              <tr>
                <th className="p-4">
                  Student
                </th>

                <th className="p-4">
                  Document
                </th>

                <th className="p-4">
                  Uploaded
                </th>

                <th className="p-4">
                  Status
                </th>

                <th className="p-4">
                  Actions
                </th>
              </tr>
            </thead>


            <tbody>

              {filteredDocuments.length ===
              0 ? (

                <tr>
                  <td
                    colSpan="5"
                    className="
                      p-10
                      text-center
                      text-gray-500
                    "
                  >
                    No documents found.
                  </td>
                </tr>

              ) : (

                filteredDocuments.map(
                  (document) => (

                    <tr
                      key={document._id}
                      className="
                        border-b
                        last:border-b-0
                        hover:bg-gray-50
                      "
                    >

                      {/* STUDENT */}
                      <td className="p-4">

                        <p className="font-semibold">
                          {document
                            .studentId
                            ?.userId
                            ?.name ||
                            "Student"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {document
                            .studentId
                            ?.userId
                            ?.email ||
                            "-"}
                        </p>

                      </td>


                      {/* DOCUMENT */}
                      <td className="p-4">

                        <p className="font-medium">
                          {document.documentType ||
                            document.type ||
                            "Document"}
                        </p>

                        {document.fileUrl && (
                          <a
                            href={
                              document.fileUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="
                              mt-1
                              inline-block
                              text-sm
                              text-blue-600
                              hover:underline
                            "
                          >
                            View Document
                          </a>
                        )}

                      </td>


                      {/* DATE */}
                      <td className="p-4">

                        {document.createdAt
                          ? new Date(
                              document.createdAt
                            ).toLocaleDateString()
                          : "-"}

                      </td>


                      {/* STATUS */}
                      <td className="p-4">

                        <span
                          className={`
                            rounded-full
                            px-3
                            py-1
                            text-sm
                            font-medium
                            ${getStatusClass(
                              document.status
                            )}
                          `}
                        >
                          {document.status ||
                            "pending"}
                        </span>

                        {document.status ===
                          "rejected" &&
                          document.rejectionReason && (
                            <p
                              className="
                                mt-2
                                max-w-xs
                                text-xs
                                text-red-600
                              "
                            >
                              {
                                document.rejectionReason
                              }
                            </p>
                          )}

                      </td>


                      {/* ACTIONS */}
                      <td className="p-4">

                        {document.status ===
                        "pending" ? (

                          <div
                            className="
                              flex
                              flex-wrap
                              gap-2
                            "
                          >

                            <button
                              disabled={
                                processingId ===
                                document._id
                              }
                              onClick={() =>
                                handleVerify(
                                  document._id
                                )
                              }
                              className="
                                rounded-lg
                                bg-green-600
                                px-4
                                py-2
                                text-sm
                                text-white
                                disabled:opacity-50
                              "
                            >
                              Verify
                            </button>


                            <button
                              disabled={
                                processingId ===
                                document._id
                              }
                              onClick={() =>
                                handleReject(
                                  document._id
                                )
                              }
                              className="
                                rounded-lg
                                bg-red-600
                                px-4
                                py-2
                                text-sm
                                text-white
                                disabled:opacity-50
                              "
                            >
                              Reject
                            </button>

                          </div>

                        ) : (

                          <span className="text-sm text-gray-500">
                            Reviewed
                          </span>

                        )}

                      </td>

                    </tr>
                  )
                )

              )}

            </tbody>

          </table>

        </div>
      </div>

    </div>
  );
};


export default PlacementDocuments;