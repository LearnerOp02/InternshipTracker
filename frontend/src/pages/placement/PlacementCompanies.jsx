/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from "react";

import {
  getCompanies,
  approveCompany,
} from "../../services/placementService";


const PlacementCompanies = () => {

  const [companies, setCompanies] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");


  useEffect(() => {
    loadCompanies();
  }, []);


  const loadCompanies = async () => {

    try {

      setLoading(true);

      const data =
        await getCompanies();

      const list =
        data.companies ||
        data.data ||
        data ||
        [];

      setCompanies(
        Array.isArray(list)
          ? list
          : []
      );

    } catch (error) {

      console.error(
        "Load companies error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to load companies"
      );

    } finally {

      setLoading(false);

    }
  };


  const handleApprove = async (
    companyId
  ) => {

    try {

      const confirmApprove =
        window.confirm(
          "Approve this company?"
        );

      if (!confirmApprove) return;


      await approveCompany(
        companyId
      );


      setMessage(
        "Company approved successfully"
      );


      loadCompanies();

    } catch (error) {

      console.error(
        "Approve company error:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Failed to approve company"
      );

    }
  };


  if (loading) {

    return (
      <div className="p-6">
        Loading companies...
      </div>
    );

  }


  return (

    <div className="p-6">

      {/* HEADER */}

      <div className="mb-6">

        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Company Management
        </h1>

        <p
          className="
            text-gray-500
            mt-2
          "
        >
          Review and approve registered
          companies.
        </p>

      </div>


      {/* MESSAGE */}

      {message && (

        <div
          className="
            mb-5
            p-4
            bg-blue-50
            border
            border-blue-200
            rounded-lg
          "
        >
          {message}
        </div>

      )}


      {/* COMPANY LIST */}

      <div
        className="
          bg-white
          border
          rounded-xl
          overflow-hidden
        "
      >

        <div className="overflow-x-auto">

          <table
            className="
              w-full
              text-left
            "
          >

            <thead
              className="
                bg-gray-50
                border-b
              "
            >

              <tr>

                <th className="p-4">
                  Company
                </th>

                <th className="p-4">
                  Industry
                </th>

                <th className="p-4">
                  Location
                </th>

                <th className="p-4">
                  Status
                </th>

                <th className="p-4">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {companies.length === 0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="
                      p-8
                      text-center
                      text-gray-500
                    "
                  >
                    No companies found.
                  </td>

                </tr>

              ) : (

                companies.map(
                  (company) => (

                    <tr
                      key={
                        company._id
                      }
                      className="
                        border-b
                        last:border-b-0
                      "
                    >

                      <td className="p-4">

                        <div
                          className="
                            font-semibold
                          "
                        >
                          {
                            company.companyName
                          }
                        </div>

                        {company.website && (

                          <div
                            className="
                              text-sm
                              text-gray-500
                            "
                          >
                            {
                              company.website
                            }
                          </div>

                        )}

                      </td>


                      <td className="p-4">

                        {
                          company.industry ||
                          "-"
                        }

                      </td>


                      <td className="p-4">

                        {
                          company.location ||
                          "-"
                        }

                      </td>


                      <td className="p-4">

                        <span
                          className="
                            px-3
                            py-1
                            text-sm
                            rounded-full
                            bg-gray-100
                          "
                        >

                          {
                            company.verificationStatus ||
                            "pending"
                          }

                        </span>

                      </td>


                      <td className="p-4">

                        {company.verificationStatus !==
                        "approved" ? (

                          <button
                            onClick={() =>
                              handleApprove(
                                company._id
                              )
                            }
                            className="
                              bg-black
                              text-white
                              px-4
                              py-2
                              rounded-lg
                              hover:opacity-80
                            "
                          >
                            Approve
                          </button>

                        ) : (

                          <span
                            className="
                              text-green-600
                              font-medium
                            "
                          >
                            Approved
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

export default PlacementCompanies;