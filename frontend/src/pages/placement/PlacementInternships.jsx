/* eslint-disable react-hooks/immutability */
import {
  useEffect,
  useState,
} from "react";

import {
  getPendingInternships,
  approveInternship,
  rejectInternship,
  publishInternship,
} from "../../services/placementService";


const PlacementInternships = () => {

  const [
    internships,
    setInternships,
  ] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");


  useEffect(() => {

    loadInternships();

  }, []);


  const loadInternships =
    async () => {

      try {

        setLoading(true);

        const data =
          await getPendingInternships();

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
          "Load internships error:",
          error
        );

        setMessage(
          error.response?.data
            ?.message ||
            "Failed to load internships"
        );

      } finally {

        setLoading(false);

      }
    };


  const handleApprove =
    async (id) => {

      try {

        await approveInternship(id);

        setMessage(
          "Internship approved successfully"
        );

        loadInternships();

      } catch (error) {

        setMessage(
          error.response?.data
            ?.message ||
            "Failed to approve internship"
        );

      }
    };


  const handleReject =
    async (id) => {

      const reason =
        window.prompt(
          "Enter rejection reason:"
        );

      if (!reason) return;


      try {

        await rejectInternship(
          id,
          reason
        );

        setMessage(
          "Internship rejected successfully"
        );

        loadInternships();

      } catch (error) {

        setMessage(
          error.response?.data
            ?.message ||
            "Failed to reject internship"
        );

      }
    };


  const handlePublish =
    async (id) => {

      try {

        await publishInternship(id);

        setMessage(
          "Internship published successfully"
        );

        loadInternships();

      } catch (error) {

        setMessage(
          error.response?.data
            ?.message ||
            "Failed to publish internship"
        );

      }
    };


  if (loading) {

    return (
      <div className="p-6">
        Loading internships...
      </div>
    );

  }


  return (

    <div className="p-6">

      <div className="mb-6">

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Internship Approval
        </h1>

        <p
          className="
            text-gray-500
            mt-2
          "
        >
          Review internships submitted
          by companies.
        </p>

      </div>


      {message && (

        <div
          className="
            mb-6
            border
            bg-blue-50
            p-4
            rounded-lg
          "
        >
          {message}
        </div>

      )}


      <div
        className="
          space-y-4
        "
      >

        {internships.length === 0 ? (

          <div
            className="
              bg-white
              border
              rounded-xl
              p-8
              text-center
              text-gray-500
            "
          >
            No pending internships.
          </div>

        ) : (

          internships.map(
            (internship) => (

              <div
                key={
                  internship._id
                }
                className="
                  bg-white
                  border
                  rounded-xl
                  p-6
                "
              >

                <div
                  className="
                    flex
                    flex-col
                    lg:flex-row
                    lg:justify-between
                    gap-6
                  "
                >

                  <div>

                    <h2
                      className="
                        text-xl
                        font-semibold
                      "
                    >
                      {
                        internship.title
                      }
                    </h2>


                    <p
                      className="
                        text-gray-500
                        mt-1
                      "
                    >
                      {
                        internship
                          .companyId
                          ?.companyName ||
                        "Company"
                      }
                    </p>


                    <div
                      className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        gap-3
                        mt-5
                        text-sm
                      "
                    >

                      <p>
                        <strong>
                          Location:
                        </strong>{" "}
                        {
                          internship.location ||
                          "-"
                        }
                      </p>


                      <p>
                        <strong>
                          Work Mode:
                        </strong>{" "}
                        {
                          internship.workMode ||
                          "-"
                        }
                      </p>


                      <p>
                        <strong>
                          Openings:
                        </strong>{" "}
                        {
                          internship.openings
                        }
                      </p>


                      <p>
                        <strong>
                          Stipend:
                        </strong>{" "}
                        {
                          internship.stipend ||
                          "-"
                        }
                      </p>


                      <p>
                        <strong>
                          Duration:
                        </strong>{" "}
                        {
                          internship.duration ||
                          "-"
                        }
                      </p>


                      <p>
                        <strong>
                          Status:
                        </strong>{" "}
                        {
                          internship.status
                        }
                      </p>

                    </div>


                    {internship.description && (

                      <p
                        className="
                          mt-5
                          text-gray-600
                        "
                      >
                        {
                          internship.description
                        }
                      </p>

                    )}

                  </div>


                  <div
                    className="
                      flex
                      flex-wrap
                      gap-3
                      items-start
                    "
                  >

                    {internship.status ===
                      "pending_approval" && (
                      <>

                        <button
                          onClick={() =>
                            handleApprove(
                              internship._id
                            )
                          }
                          className="
                            bg-green-600
                            text-white
                            px-4
                            py-2
                            rounded-lg
                          "
                        >
                          Approve
                        </button>


                        <button
                          onClick={() =>
                            handleReject(
                              internship._id
                            )
                          }
                          className="
                            bg-red-600
                            text-white
                            px-4
                            py-2
                            rounded-lg
                          "
                        >
                          Reject
                        </button>

                      </>
                    )}


                    {internship.status ===
                      "approved" && (

                      <button
                        onClick={() =>
                          handlePublish(
                            internship._id
                          )
                        }
                        className="
                          bg-black
                          text-white
                          px-4
                          py-2
                          rounded-lg
                        "
                      >
                        Publish
                      </button>

                    )}

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

export default PlacementInternships;