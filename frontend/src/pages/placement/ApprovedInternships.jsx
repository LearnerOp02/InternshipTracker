/* eslint-disable react-hooks/immutability */
import {
  useEffect,
  useState,
} from "react";

import {
  getApprovedInternships,
  publishInternship,
} from "../../services/placementService";


const ApprovedInternships = () => {
  const [
    internships,
    setInternships,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [publishingId, setPublishingId] =
    useState(null);


  useEffect(() => {
    loadInternships();
  }, []);


  const loadInternships = async () => {
    try {
      setLoading(true);

      const data =
        await getApprovedInternships();

      const list =
        data.internships ||
        data.data ||
        data ||
        [];

      setInternships(
        Array.isArray(list)
          ? list
          : []
      );

    } catch (error) {
      console.error(
        "Load approved internships error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to load approved internships"
      );

    } finally {
      setLoading(false);
    }
  };


  const handlePublish = async (
    internshipId
  ) => {
    const confirmed =
      window.confirm(
        "Publish this internship for students?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setPublishingId(
        internshipId
      );

      setMessage("");

      const data =
        await publishInternship(
          internshipId
        );

      setMessage(
        data.message ||
          "Internship published successfully"
      );

      // Remove published internship
      // from approved list
      setInternships(
        (current) =>
          current.filter(
            (internship) =>
              internship._id !==
              internshipId
          )
      );

    } catch (error) {
      console.error(
        "Publish internship error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to publish internship"
      );

    } finally {
      setPublishingId(null);
    }
  };


  if (loading) {
    return (
      <div className="p-6">
        Loading approved internships...
      </div>
    );
  }


  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Approved Internships
        </h1>

        <p className="mt-2 text-gray-500">
          Publish internships that have
          already been approved by the
          Placement Cell.
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


      {/* COUNT */}
      <div
        className="
          mb-6
          rounded-xl
          border
          bg-white
          p-5
        "
      >
        <p className="text-sm text-gray-500">
          Ready to Publish
        </p>

        <p className="mt-1 text-3xl font-bold">
          {internships.length}
        </p>
      </div>


      {/* INTERNSHIPS */}
      <div className="space-y-4">

        {internships.length === 0 ? (

          <div
            className="
              rounded-xl
              border
              bg-white
              p-10
              text-center
            "
          >
            <h2 className="text-lg font-semibold">
              No approved internships
            </h2>

            <p className="mt-2 text-gray-500">
              Internships approved by the
              Placement Cell will appear
              here.
            </p>
          </div>

        ) : (

          internships.map(
            (internship) => (

              <div
                key={internship._id}
                className="
                  rounded-xl
                  border
                  bg-white
                  p-6
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    gap-6
                    lg:flex-row
                    lg:items-start
                    lg:justify-between
                  "
                >

                  {/* DETAILS */}
                  <div className="flex-1">

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                      "
                    >

                      <h2
                        className="
                          text-xl
                          font-bold
                        "
                      >
                        {internship.title}
                      </h2>

                      <span
                        className="
                          rounded-full
                          bg-green-100
                          px-3
                          py-1
                          text-sm
                          font-medium
                          text-green-700
                        "
                      >
                        Approved
                      </span>

                    </div>


                    <p
                      className="
                        mt-2
                        font-medium
                        text-gray-600
                      "
                    >
                      {internship
                        .companyId
                        ?.companyName ||
                        "Company"}
                    </p>


                    <div
                      className="
                        mt-5
                        grid
                        grid-cols-1
                        gap-4
                        text-sm
                        md:grid-cols-2
                        xl:grid-cols-3
                      "
                    >

                      <div>
                        <p className="text-gray-500">
                          Location
                        </p>

                        <p className="font-medium">
                          {internship.location ||
                            "-"}
                        </p>
                      </div>


                      <div>
                        <p className="text-gray-500">
                          Work Mode
                        </p>

                        <p className="font-medium">
                          {internship.workMode ||
                            "-"}
                        </p>
                      </div>


                      <div>
                        <p className="text-gray-500">
                          Duration
                        </p>

                        <p className="font-medium">
                          {internship.duration ||
                            "-"}
                        </p>
                      </div>


                      <div>
                        <p className="text-gray-500">
                          Stipend
                        </p>

                        <p className="font-medium">
                          {internship.stipend ||
                            "-"}
                        </p>
                      </div>


                      <div>
                        <p className="text-gray-500">
                          Openings
                        </p>

                        <p className="font-medium">
                          {internship.openings ||
                            "-"}
                        </p>
                      </div>


                      <div>
                        <p className="text-gray-500">
                          Deadline
                        </p>

                        <p className="font-medium">
                          {internship.applicationDeadline
                            ? new Date(
                                internship.applicationDeadline
                              ).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>

                    </div>


                    {internship.description && (
                      <div className="mt-5">

                        <p className="mb-1 text-sm font-semibold">
                          Description
                        </p>

                        <p className="text-sm text-gray-600">
                          {
                            internship.description
                          }
                        </p>

                      </div>
                    )}

                  </div>


                  {/* ACTION */}
                  <div>

                    <button
                      type="button"
                      disabled={
                        publishingId ===
                        internship._id
                      }
                      onClick={() =>
                        handlePublish(
                          internship._id
                        )
                      }
                      className="
                        rounded-lg
                        bg-black
                        px-5
                        py-2.5
                        font-medium
                        text-white
                        transition
                        hover:opacity-80
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {publishingId ===
                      internship._id
                        ? "Publishing..."
                        : "Publish Internship"}
                    </button>

                  </div>

                </div>

              </div>

            )
          )

        )}

      </div>

    </div>
  );
};


export default ApprovedInternships;